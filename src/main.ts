const getUserById = (id: number): Promise<User> =>
  new Promise((resolve) => {
    const users = [
      {
        id: 1,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 26,
        isActive: true,
      },
      {
        id: 2,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 27,
        isActive: false,
      },
      {
        id: 3,
        firstname: "Giorgi",
        lastname: "Bazerashvili",
        age: 28,
        isActive: true,
      },
    ];
    setTimeout(() => {
      resolve(users.find((u) => u.id == id));
    }, 3000);
  });

function memo(minutes: number) {
  const cache = new Map<number, User & { expiresAt: number }>();

  return function (
    target: Object,
    key: string | number | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const id = args[0];
      if (cache.has(id)) {
        const user = cache.get(id);

        if (Date.now() < user?.expiresAt) {
          return Promise.resolve(user);
        }
      }

      return original.apply(this, args).then((user) => {
        cache.set(id, {
          ...user,
          expiresAt: Date.now() + minutes * 60 * 1000,
        });
        return user;
      });
    };
  };
}

class UsersService {
  @memo(1) // <- Implement This Decorator
  getUserById(id: number): Promise<User> {
    return getUserById(id);
  }
}

interface User {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  isActive: boolean;
}

const usersService = new UsersService();

const btn = document.getElementById("btn")! as HTMLButtonElement;
const input = document.getElementById("userId");
const loading = document.getElementById("loading")! as HTMLDivElement;

btn.addEventListener("click", async () => {
  loading.innerHTML = "loading";
  await usersService
    .getUserById(+(input as HTMLInputElement).value)
    .then((x) => console.log(x));
  loading.innerHTML = "";
});
