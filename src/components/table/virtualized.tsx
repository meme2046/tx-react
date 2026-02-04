import type { FetchNextPageOptions } from "@tanstack/react-query";
import type {
  OnChangeFn,
  RowData,
  SortingState,
  Table,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import type { Dispatch } from "react";
import { TableBase } from "./table-base";

interface IVirtualizedTable<T> {
  table: Table<T>;
  rowsPerPage: string;
  estimateRowHeight: number;
  overscan: number;
  subHeight: number;
  setSorting: Dispatch<React.SetStateAction<SortingState>>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: (options?: FetchNextPageOptions) => Promise<unknown>;
  isFetching: boolean;
  isLoading: boolean;
  keyField?: string;
}

export function VirtualizedTable<T extends RowData>(
  props: IVirtualizedTable<T>,
) {
  const {
    table,
    rowsPerPage,
    estimateRowHeight,
    overscan,
    subHeight,
    setSorting,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    fetchNextPage,
    keyField,
  } = props;

  const { rows } = table.getRowModel();
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => estimateRowHeight, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: overscan,
  });

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    // 更全面的检查确保可以安全滚动
    if (rows.length > 0 && rowVirtualizer.scrollElement) {
      requestAnimationFrame(() => {
        if (rowVirtualizer.scrollElement && rows.length > 0) {
          rowVirtualizer.scrollToIndex(0);
        }
      });
    }
  };

  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  useEffect(() => {
    // 更全面的检查确保可以安全滚动
    if (rowsPerPage && rowVirtualizer.scrollElement && rows.length > 0) {
      requestAnimationFrame(() => {
        if (rowVirtualizer.scrollElement && rows.length > 0) {
          rowVirtualizer.scrollToIndex(0);
        }
      });
    }
  }, [rowVirtualizer, rowsPerPage, rows.length]);

  const virtualItems = rowVirtualizer.getVirtualItems();
  const [lastVirtualIndex, setLastVirtualIndex] = useState<number>(-1);
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem || lastItem.index === lastVirtualIndex) {
      return;
    }
    setLastVirtualIndex(lastItem.index);

    if (
      lastItem.index >= rows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isFetching
    ) {
      fetchNextPage?.().then();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    lastVirtualIndex,
    rows.length,
    virtualItems,
  ]);
  const minFixedWidth = 128;
  return (
    <TableBase
      tableContainerRef={tableContainerRef}
      subHeight={subHeight}
      table={table}
      minFixedWidth={minFixedWidth}
      isFetching={isFetching}
      isLoading={isLoading}
      rowVirtualizer={rowVirtualizer}
      hasNextPage={hasNextPage}
      keyField={keyField}
    />
  );
}
