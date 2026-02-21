import { createContext, useContext, useState, useEffect } from "react";

import { getTables } from "../api";
import { detectIssues } from "../api/governance";

const TableContext = createContext();

export function TableProvider({ children, onIssueCount }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await getTables();
      setTables(data);
      onIssueCount?.(data.filter((t) => detectIssues(t).length > 0).length);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  return (
    <TableContext.Provider
      value={{ tables, loading, error, refresh: loadTables }}
    >
      {children}
    </TableContext.Provider>
  );
}

export const useTables = () => useContext(TableContext);
