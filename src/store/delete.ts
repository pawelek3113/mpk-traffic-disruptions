import db from "./db.js";

export const deleteIssues = (ids: string[]) => {
  const deleteStmt = db.prepare(`
  DELETE from issues
  WHERE id = ?
  `);

  const transaction = db.transaction((ids: string[]) => {
    ids.forEach((id) => {
      deleteStmt.run(id);
    });
  });

  try {
    transaction(ids);
  } catch (e) {
    console.error("Delete transaction failed and was rolled back.")
  }
};
