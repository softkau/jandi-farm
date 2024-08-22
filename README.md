This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Backend API
이하 백엔드 API 엔드포인트를 설명  
/api-test에 접속하면 간단하게 테스트해볼 수 있습니다.

### 백엔드 TODO
 * 유튜브처럼 handle(ID)을 직접 유저가 적을 수 있는 registration page 기능 구현
   - 이렇게 하면 ObjectID가 아닌 좀 더 읽기 쉬운 handle(ID)로 동적라우팅을 할 수 있을 것
   - 또한 project도 title을 `handle/project-name` 형태로 만들어서 같은 이름 충돌 이슈도 해결 가능
 * tag나 title, detail 내용등으로 검색하는 기능
   - 해당 라우팅은 어떻게 할지 미정
 * 관리자 계정/권한(아직은 필요없음)

## /api/auth/[...nextauth]
[NextAuth](https://next-auth.js.org/) 기반 로그인 및 인증 엔드포인트
 * GET
 * POST

### AuthProviders:
 * Google  
 (추후 더 지원 예정)

### NextAuth 공식 문서:
 * [Client API](https://next-auth.js.org/getting-started/client)
 * [REST API](https://next-auth.js.org/getting-started/rest-api)

## /api/todo/new
todo 생성 엔드포인트
 * POST  
   `Todo` 데이터 베이스에 `body` 내용을 기반으로 todo를 생성  
   인증이 되지 않았을시 `401` 반환
```js
body: {
  title: "title",
  detail: "details...",
  due_date: "년/월/일", // Date()로 파싱 가능한 문자열
  tag: "tag(no_spaces)", // 현재로는 tag 1개만 가능
  project: "proj_name(no_spaces)", // 존재하는 project에 연결
  status: {
    done: false,
    is_public: false // 공개 상태
  }
}
```

## /api/todo/[id]
todo 조회/수정/삭제 엔드포인트  
인증 정보와 todo의 소유자가 일치하지 않을 시 실패
 * GET  
   요청한 `id`의 todo를 조회  
   만약 `todo.status.is_public === true`이면 소유자가 달라도 조회 가능
 * PATCH  
   요청한 `id`의 todo를 수정
 * DELETE  
   요청한 `id`의 todo를 `Todo` 데이터베이스에서 삭제

## /api/project/new
project 생성 엔드포인트
 * POST  
   `Project` 데이터 베이스에 `body` 내용을 기반으로 project를 생성  
   인증이 되지 않았을시 `401` 반환  
   (업데이트: 이제 user 별 `title` 중복 검사가 이루어집니다. 따라서 다른 유저와의 동일한 `title` 값으로 충돌이 발생하지 않습니다)
```js
body: {
  title: "title",
  detail: "details...",
  due_date: "년/월/일", // Date()로 파싱 가능한 문자열
  status: {
    is_public: false // 공개 상태
  }
}
```

## /api/project/[id]
project 조회/수정/삭제 엔드포인트  
인증 정보와 project의 소유자가 일치하지 않을 시 실패
 * GET  
   요청한 `id`의 project를 조회  
   만약 `project.status.is_public === true`이면 소유자가 달라도 조회 가능
 * PATCH  
   요청한 `id`의 project를 수정
 * DELETE  
   요청한 `id`의 project를 `Project` 데이터베이스에서 삭제

## /api/project/[id]/todo
`id`에 해당하는 project에 포함된 todo를 전부 조회하는 엔드포인트
 * GET  
   요청한 `id`의 project에 포함된 todo를 조회  
   이 엔드포인트에서는 개별 todo의 `is_public`값은 무시하고  
   project의 `is_public`만 고려하여 조회한다

## /api/user/[id]/todo
`id`에 해당하는 유저의 todo를 전부 조회하는 엔드포인트  
소유자가 아닌 경우, 공개 설정된 todo만 조회 가능
 * GET  
 요청한 `id`를 가진 유저의 todo를 조회하여 `Array`로 반환한다  
 다른 유저의 todo는 `is_public`이 `true`인 경우만 반환한다

## /api/user/[id]/project
`id`에 해당하는 유저의 project를 전부 조회하는 엔드포인트  
소유자가 아닌 경우, 공개 설정된 project만 조회 가능
 * GET  
   요청한 `id`를 가진 유저의 project를 조회하여 `Array`로 반환한다  
   다른 유저의 project는 `is_public`이 `true`인 경우만 반환한다

## /api/user/[id]/tag
`id`에 해당하는 유저의 tag를 조회 및 수정하는 엔드포인트  
인증 유저와 일치해야만 이용 가능  
요청이 성공 했을 때 `response.body`에는 (변경사항이 적용된) tag `Array`가 반환된다
 * GET  
   요청한 `id`를 가진 유저가 저장한 tag를 `Array`로 반환  
   성공 시 응답코드는 `200`
 * POST  
   `request.body`의 `tags` 속성의 tag값들을 중복을 제거하여 UserDB에 저장  
   성공 시 응답코드는 `200`
   ```json
   { // JSON 요청 예시 (User.data.tags에 'tag1', 'tag2', 'tag3'이 추가됨)
    "tags": ["tag1", "tag2", "tag3"]
   }
   ```
 * PUT  
   `request.body`의 `tags` 배열 전체를 UserDB에 덮어씌워 저장  
   성공 시 응답코드는 `200`
   ```json
   { // JSON 요청 예시 (User.data.tags가 ['tag1', 'tag2', 'tag3']이 됨)
     "tags": ["tag1", "tag2", "tag3"]
   }
   ```
 * DELETE  
   `request.body`의 `tags` 배열에 포함된 tag값들을 UserDB에서 제거  
   성공 시 응답코드는 `200`  
   ```json
   { // JSON 요청 예시 (User.data.tags에서 'tag1'만 제거됨)
     "tags": ["tag1"]
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
