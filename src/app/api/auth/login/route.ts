
// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validate input with Zod
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // ✅ Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // ✅ Compare passwords
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // ✅ Generate JWT (store only non-sensitive fields)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!, // 👈 make sure this exists in .env
      { expiresIn: "7d" }
    );

    // ✅ Return token as HTTP-only cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { loginSchema } from "@/lib/validation";
// import { createJWT } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password } = loginSchema.parse(body);

//     // find user
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
//     }

//     // check password
//     const valid = await bcrypt.compare(password, user.passwordHash);
//     if (!valid) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
//     }

//     // create JWT
//     const token = await createJWT({
//       sub: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     // return token + user info
//     return NextResponse.json({
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         username: user.username,
//         fullName: user.fullName,
//         role: user.role,
//       },
//     });
//   } catch (err: any) {
//     if (err?.issues) {
//       return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
//     }
//     return NextResponse.json({ error: "Login failed" }, { status: 500 });
//   }
// }




// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { loginSchema } from "@/lib/validation";
// import { createJWT, setSessionCookie } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password } = loginSchema.parse(body);

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
//     }

//     const valid = await bcrypt.compare(password, user.passwordHash);
//     if (!valid) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
//     }

//     const token = createJWT({
//       sub: user.id,
//       email: user.email,
//       role: user.role,
//     });

//     setSessionCookie(token);

//     return NextResponse.json({
//       user: {
//         id: user.id,
//         email: user.email,
//         username: user.username,
//         fullName: user.fullName,
//         role: user.role,
//       },
//     });
//   } catch (err: any) {
//     if (err?.issues) {
//       return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
//     }
//     return NextResponse.json({ error: "Login failed" }, { status: 500 });
//   }
// }





// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { loginSchema } from "@/lib/validation";
// import { createJWT, setSessionCookie } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password } = loginSchema.parse(body);

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

//     const ok = await bcrypt.compare(password, user.passwordHash);
//     if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

//     const token = await createJWT({
//       sub: user.id,
//       email: user.email,
//       role: user.role,
//     });
//     setSessionCookie(token);

//     return NextResponse.json({
//       user: { id: user.id, email: user.email, username: user.username, fullName: user.fullName, role: user.role },
//     });
//   } catch (err: any) {
//     if (err?.issues) {
//       return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
//     }
//     return NextResponse.json({ error: "Login failed" }, { status: 500 });
//   }
// }
