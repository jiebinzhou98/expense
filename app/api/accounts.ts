// export type Account = {id: string; name: string; currency: string; created_at: string}
// export async function fetchAccounts(): Promise<Account[]> {
//   const res = await fetch('/api/account', {cache: 'no-store'});
//   const json = await res.json();
//   if(!res.ok) throw new Error (json.error || 'Failed to load accounts');
//   return json.accounts as Account[];
// }

// export async function createAccount(input: {name: string; currency: string}){
//   const res = await fetch('/api/accounts', {
//     method: 'POST',
//     headers: {'content-type': 'application/json'},
//     body: JSON.stringify(input)
//   })
//   const json = await res.json();
//   if(!res.ok) throw new Error(json.error || 'Failed to created account');
// }

// export async function deleteAccount(id: string){
//   const res = await fetch(`/api/accounts/${id}`, {method: 'DELETE'})
//   const json = await res.json();
//   if(!res.ok) throw new Error(json.error || 'Failed to delete account');
// }