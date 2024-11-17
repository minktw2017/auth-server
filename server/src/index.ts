import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { t } from "elysia";

// 模擬的用戶資料庫
const users: { email: string; password_hash: string }[] = [];

const jwtConfig = jwt({
  secret: process.env.JWT_SECRET,
  name: "jwt_auth",
});

const app = new Elysia()
  .use(jwtConfig)
  .post("signup", (request) => {
    // 1. 確保用戶尚未存在
    // 2. 若已存在，返回錯誤；否則創建新用戶
    // 3. 使用JWT生成令牌並返回
    const { email, password } = request.body;
    const existingUser = users(user => user.email === email);

    if (existingUser) return request.error(400, "User already exists");

    const newUser = { email, password_hash: password };
    user.push(newUser);

    return { message: "User created successfully" };
  })
  .post("login", (request) => {
    // 1. 查找用戶
    // 2. 若用戶不存在，返回錯誤；否則驗證密碼
    // 3. 密碼不匹配時返回錯誤；若匹配，使用JWT生成令牌並返回
    const { email, password } = request.body;
    const user = users.find(user => user.email === email);

    if (!user || user.password_hash !== password) {
      return request.error(400, "Invalid credentials")
    };

    const token = request.jwt_auth.sign({ email });
    return { access_token: token };
  })
  .get("/watchdog", () => "I am running")
  .get("/", () => "Hello Elysia, I am running").listen(process.env.PORT)
  .get("/me", (request) => {
    const user = request.user;
    
    if (!user) return request.error(401, "Unauthorized");
    return { email: user.email };
  })
  

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
