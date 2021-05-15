export async function findAll(table: TableNames) {
  const data = await fetch(`${Deno.env.get("DB_URL")}/v1/${table}/`, {
    headers: {
      Authorization: Deno.env.get("DB_AUTHORIZATION") || "",
    },
  })
    .then((res) => res.json())
    .catch(console.error);

  return data;
}

export async function findOne(table: TableNames, key: string) {
  const data = await fetch(`${Deno.env.get("DB_URL")}/v1/${table}/${key}`, {
    headers: {
      Authorization: Deno.env.get("DB_AUTHORIZATION") || "",
    },
  })
    .then((res) => res.json())
    .catch(console.error);

  return data;
}

export async function upsert(table: TableNames, key: string, payload: Record<string, unknown>) {
  const data = await fetch(`${Deno.env.get("DB_URL")}/v1/${table}/${key}`, {
    headers: {
      Authorization: Deno.env.get("DB_AUTHORIZATION") || "",
    },
    body: JSON.stringify({ ...payload, _id: key }),
    method: "PUT",
  })
    .then((res) => res.json())
    .catch(console.error);

  return data;
}

export async function deleteOne(table: TableNames, key: string) {
  const data = await fetch(`${Deno.env.get("DB_URL")}/v1/${table}/${key}`, {
    headers: {
      Authorization: Deno.env.get("DB_AUTHORIZATION") || "",
    },
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch(console.error);

  return data;
}

const database = {
  deleteOne,
  findAll,
  findOne,
  upsert,
};

export default database;

export type TableNames = "guilds" | "users";
