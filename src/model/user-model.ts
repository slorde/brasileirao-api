import sql from '../helpers/db'

type UserType = {
  id: string,
  login: string,
  password: string,
  createdAt: Date
}

class User {
  async findByLogin(login: string): Promise<UserType|null> {
    const users = await sql`
          select
            id,
            login,
            password,
            created_at
          from users
          where login = ${login}
        `;

    if (!users.length) {
      return null;
    }
 
    return { id: users[0].id, login: users[0].login, password: users[0].password, createdAt: users[0].created_at };
  }

  async insertUser(id: string, login: string, password: string) {
    const users = await sql`
          insert into users
            (login, password)
          values
            (${login}, ${password})
          returning name, age
        `
    // users = Result [{ name: "Murray", age: 68 }]
    return users
  }
}

export default User;