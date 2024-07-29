This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Backend API
이하 백엔드 API 엔드포인트를 설명

## /api/auth/[...nextauth]
[NextAuth](https://next-auth.js.org/) 기반 로그인 및 인증 엔드포인트
 * GET
 * POST

### AuthProviders:
 * Google

### NextAuth 공식 문서:
 * [Client API](https://next-auth.js.org/getting-started/client)
 * [REST API](https://next-auth.js.org/getting-started/rest-api)

## /api/todo/new
todo 생성 엔드포인트
 * POST  
   `Todo` 데이터 베이스에 `body` 내용을 기반으로 todo를 생성  
   인증이 되지 않았을시 `401` 반환
   (현재 project 필드 미구현)
```js
body: {
  title: "title",
  detail: "details...",
  due_date: "년/월/일", // Date()로 파싱 가능한 문자열
  tag: "tag(no_spaces)", // 현재로는 tag 1개만 가능
  project: "proj_name(no_spaces)", // 존재하는 project에 연결(미구현)
  status: {
    done: false, // (미구현)
    is_public: false // 공개 상태 (미구현)
  }
}
```
## /api/todo/[id]
todo 조회/수정/삭제 엔드포인트(미구현)  
인증 정보와 todo의 소유자가 일치하지 않을 시 실패
 * GET  
   요청한 `id`의 todo를 조회  
   만약 `todo.status.is_public === true`이면 소유자가 달라도 조회 가능
 * PATCH  
   요청한 `id`의 todo를 수정
 * DELETE  
   요청한 `id`의 todo를 `Todo` 데이터베이스에서 삭제

## /api/project/new
project 생성 엔드포인트 (미구현)
 * POST  
   `Project` 데이터 베이스에 `body` 내용을 기반으로 project를 생성  
   인증이 되지 않았을시 `401` 반환
```js
body: {
  title: "title",
  detail: "details...",
  due_date: "년/월/일", // Date()로 파싱 가능한 문자열
  status: {
    is_public: false // 공개 상태 (미구현)
  }
}
```

# Next.js Generated Docs

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
