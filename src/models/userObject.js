export function User(
  id,
  account_created,
  email,
  password,
  access_role,
  firstname,
  lastname,
  last_login,
  authentication_key
) {
  return {
    id,
    account_created,
    email,
    password,
    access_role,
    firstname,
    lastname,
    last_login,
    authentication_key,
  };
}
