import * as React from 'react';

import { usePaginationFragment, graphql } from 'react-relay/hooks';
import type { ClientTablePaginationQuery } from './__generated__/ClientTablePaginationQuery.graphql';
import { ClientTable_clients$key } from './__generated__/ClientTable_clients.graphql';
import { useMemo } from 'react';
import { Checkbox, DataTable } from 'react-native-paper';
import { GestureResponderEvent, View } from 'react-native';
import LinkButton from '../../Components/LinkButton';

export type ClientTableProps = Readonly<{
  fragmentRef: ClientTable_clients$key;
}>;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<T>(
  order: Order,
  orderBy: keyof T
): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(([el]) => el);
}

interface HeadCell<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
}

type EnhancedTableProps<T> = Readonly<{
  numSelected: number;
  onRequestSort: (event: GestureResponderEvent, property: keyof T) => void;
  onSelectAllClick: (event: GestureResponderEvent) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell<T>[];
}>;

function EnhancedTableHead<T>(props: EnhancedTableProps<T>) {
  const { onSelectAllClick, numSelected, rowCount, onRequestSort, headCells } =
    props;
  const createSortHandler =
    (property: keyof T) => (event: GestureResponderEvent) => {
      onRequestSort(event, property);
    };

  return (
    <DataTable.Header>
      <DataTable.Row>
        <DataTable.Cell>
          <Checkbox
            status={numSelected === rowCount ? 'checked' : 'unchecked'}
            // indeterminate={numSelected > 0 && numSelected < rowCount}
            onPress={onSelectAllClick}
          />
        </DataTable.Cell>
        {headCells.map((headCell) => (
          <DataTable.Cell
            key={headCell.id as string}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            // sortDirection={orderBy === headCell.id ? order : false}
          >
            <DataTable.Title
              // active={orderBy === headCell.id}
              // direction={orderBy === headCell.id ? order : 'asc'}
              onPress={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {/* {orderBy === headCell.id ? (
                <View>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </View>
              ) : null} */}
            </DataTable.Title>
          </DataTable.Cell>
        ))}
      </DataTable.Row>
    </DataTable.Header>
  );
}

export default function ClientTable({ fragmentRef }: ClientTableProps) {
  const { data, refetch } = usePaginationFragment<
    ClientTablePaginationQuery,
    ClientTable_clients$key
  >(
    graphql`
      fragment ClientTable_clients on Query
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 15 }
      )
      @refetchable(queryName: "ClientTablePaginationQuery") {
        clients(first: $count, after: $cursor, order: { name: ASC })
          @connection(key: "ClientTable_clients") {
          edges {
            node {
              id
              name
              subscription {
                status
              }
              customerId
              phoneNumber
              slug
              subscribeLink
              subscriberCount
            }
            cursor
          }
        }
      }
    `,
    fragmentRef
  );

  const rows = useMemo(
    () =>
      data.clients?.edges?.map(({ node, cursor }) => ({
        ...node,
        cursor,
        subscriptionStatus: node.subscription?.status ?? 'None',
      })) ?? [],
    [data]
  );

  type Row = (typeof rows)[0];

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Row>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleRequestSort = (_: GestureResponderEvent, property: keyof Row) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (_: GestureResponderEvent) => {
    if (selected.length === rows.length) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_: GestureResponderEvent, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    refetch({
      count: rowsPerPage,
      cursor: rows[newPage * rowsPerPage - 1]?.cursor,
    });
  };

  const handleChangeRowsPerPage = (val: number) => {
    setRowsPerPage(val);
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const from = page * rowsPerPage;
  const to = Math.min((page + 1) * rowsPerPage, rows.length);

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rows, rowsPerPage]
  );

  return (
    <View style={{ width: '100%' }}>
      <DataTable>
        <EnhancedTableHead<Row>
          headCells={[
            {
              id: 'name',
              numeric: false,
              disablePadding: true,
              label: 'Name',
            },
            {
              id: 'subscriptionStatus',
              numeric: false,
              disablePadding: true,
              label: 'Subscription Status',
            },
            {
              id: 'subscriberCount',
              numeric: true,
              disablePadding: true,
              label: 'Subscriber Count',
            },
            {
              id: 'subscribeLink',
              numeric: false,
              disablePadding: true,
              label: 'Subscribe Link',
            },
          ]}
          numSelected={selected.length}
          order={order}
          orderBy={orderBy}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={rows.length}
        />
        {visibleRows.map((row) => {
          const isItemSelected = isSelected(row.id as string);

          return (
            <DataTable.Row key={row.id}>
              <DataTable.Cell>
                <Checkbox
                  status={isItemSelected ? 'checked' : 'unchecked'}
                  onPress={(event) => handleClick(event, row.id)}
                />
              </DataTable.Cell>
              <DataTable.Cell>
                <LinkButton
                  to={{ screen: 'Client', params: { id: row.id } }}
                  label={row.name}
                />
              </DataTable.Cell>
              <DataTable.Cell>{row.subscriptionStatus}</DataTable.Cell>
              <DataTable.Cell>{row.subscriberCount}</DataTable.Cell>
            </DataTable.Row>
          );
        })}
      </DataTable>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(rows.length / rowsPerPage)}
        onPageChange={handleChangePage}
        label={`${from + 1}-${to} of ${rows.length}`}
        numberOfItemsPerPageList={[15]}
        numberOfItemsPerPage={rowsPerPage}
        onItemsPerPageChange={handleChangeRowsPerPage}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </View>
  );
}
