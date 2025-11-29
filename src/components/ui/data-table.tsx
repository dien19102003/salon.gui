'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from './skeleton';

// Helper function to get nested values from an object
function get(obj: any, path: string, defaultValue: any = null) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

export interface ColumnDef<T> {
  key: string;
  title: React.ReactNode;
  pathValue?: string; // Dot notation for nested objects
  className?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface ApiResponse<T> {
  meta: {
    traceId: string;
    success: boolean;
    total: number;
    page: number;
    size: number;
    pageCount: number;
    canNext: boolean;
    canPrev: boolean;
  };
  data: T[];
}

export type FetchData<T> = (page: number, size: number) => Promise<ApiResponse<T>>;

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  fetchData: FetchData<T>;
  initialPage?: number;
  initialSize?: number;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  fetchData,
  initialPage = 1,
  initialSize = 10,
}: DataTableProps<T>) {
  const [data, setData] = React.useState<T[]>([]);
  const [meta, setMeta] = React.useState<ApiResponse<T>['meta'] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(initialPage);
  const [size, setSize] = React.useState(initialSize);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchData(page, size);
        setData(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Optionally, handle the error in the UI
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, size, fetchData]);

  const handleNextPage = () => {
    if (meta?.canNext) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (meta?.canPrev) {
      setPage(page - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: size }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((col) => {
                    const value = get(item, col.pathValue || col.key);
                    return (
                      <TableCell key={col.key} className={col.className}>
                        {col.render ? col.render(value, item) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {meta && (
            `Showing ${((meta.page - 1) * meta.size) + 1} to ${Math.min(meta.page * meta.size, meta.total)} of ${meta.total} entries`
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={!meta?.canPrev || loading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!meta?.canNext || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
