import { createColumnHelper, createTable, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

// import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: "In Relationship",
    progress: 50,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: "Single",
    progress: 80,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: "Complicated",
    progress: 10,
  },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("firstName", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("visits", {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("progress", {
    header: "Profile Progress",
    footer: (info) => info.column.id,
  }),
];

export const DataGrid = () => {
  const columns: ColumnDef<Person>[] = []; //Pass User type as the generic TData type
  // use one of these two, not both

  //   const columnHelper = createColumnHelper<Person>();
  //   // Make some columns!
  //   const defaultColumns = [
  //     // Display Column
  //     columnHelper.display({
  //       id: "actions",
  //       cell: (props) => <RowActions row={props.row} />,
  //     }),
  //     // Grouping Column
  //     columnHelper.group({
  //       header: "Name",
  //       footer: (props) => props.column.id,
  //       columns: [
  //         // Accessor Column
  //         columnHelper.accessor("firstName", {
  //           cell: (info) => info.getValue(),
  //           footer: (props) => props.column.id,
  //         }),
  //         // Accessor Column
  //         columnHelper.accessor((row) => row.lastName, {
  //           id: "lastName",
  //           cell: (info) => info.getValue(),
  //           header: () => <span>Last Name</span>,
  //           footer: (props) => props.column.id,
  //         }),
  //       ],
  //     }),
  //     // Grouping Column
  //     columnHelper.group({
  //       header: "Info",
  //       footer: (props) => props.column.id,
  //       columns: [
  //         // Accessor Column
  //         columnHelper.accessor("age", {
  //           header: () => "Age",
  //           footer: (props) => props.column.id,
  //         }),
  //         // Grouping Column
  //         columnHelper.group({
  //           header: "More Info",
  //           columns: [
  //             // Accessor Column
  //             columnHelper.accessor("visits", {
  //               header: () => <span>Visits</span>,
  //               footer: (props) => props.column.id,
  //             }),
  //             // Accessor Column
  //             columnHelper.accessor("status", {
  //               header: "Status",
  //               footer: (props) => props.column.id,
  //             }),
  //             // Accessor Column
  //             columnHelper.accessor("progress", {
  //               header: "Profile Progress",
  //               footer: (props) => props.column.id,
  //             }),
  //           ],
  //         }),
  //       ],
  //     }),
  //   ];

  const tablex = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() });
  console.log("the table instance >>> ", tablex.getState().rowSelection);

  return <div></div>;
  // my DataGrid comp ends
};
