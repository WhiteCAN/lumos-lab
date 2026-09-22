"use client";

import { FormEvent, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { API_BASE_URL } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  KeyRoundIcon,
  LockKeyholeIcon,
  PlayIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";

import { getStudyPage } from "@/lib/study-pages";

const studyPage = getStudyPage("/backend/security-auth");

type TokenResponse = {
  accessToken: string;
  tokenType: string;
  issuedAt: string;
  expiresAt: string;
  decodedHeader: Record<string, unknown>;
  decodedPayload: Record<string, unknown>;
  steps: string[];
};

type ProtectedResponse = {
  authenticated: boolean;
  authorized: boolean;
  requiredRole: string;
  username: string;
  role: string;
  claims: Record<string, unknown>;
  steps: string[];
};

type OAuthResponse = {
  provider: string;
  authorizationCode: string;
  providerAccessToken: string;
  providerUserInfo: Record<string, unknown>;
  serviceToken: TokenResponse;
  steps: string[];
};

const authCards = [
  ["Authentication", "누구인지 확인합니다.", "아이디/비밀번호, OAuth 로그인, 인증서 등"],
  ["Authorization", "무엇을 할 수 있는지 확인합니다.", "ROLE_USER, ROLE_ADMIN, 리소스 소유자 검사"],
  ["JWT", "서버가 서명한 토큰입니다.", "access token, refresh token, claim, signature"],
  ["OAuth 2.0", "다른 서비스에 권한 위임을 하는 표준 흐름입니다.", "Google 로그인, Kakao 로그인, GitHub 로그인"],
];

const jwtFlow = ["로그인 요청", "서버가 사용자 확인", "Access Token 발급", "Authorization 헤더로 전송", "서명과 만료 확인", "권한 확인 후 API 처리"];
const oauthFlow = ["소셜 로그인 클릭", "Provider 인증", "Authorization Code 수신", "code로 token 교환", "사용자 정보 조회", "우리 서비스 JWT 발급"];

export default function SecurityAuthPage() {
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState("USER");
  const [ttlSeconds, setTtlSeconds] = useState(300);
  const [requiredRole, setRequiredRole] = useState("USER");
  const [token, setToken] = useState("");
  const [loginResult, setLoginResult] = useState<TokenResponse | null>(null);
  const [protectedResult, setProtectedResult] = useState<ProtectedResponse | null>(null);
  const [oauthResult, setOauthResult] = useState<OAuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function login(event?: FormEvent<HTMLFormElement>, overrideTtl?: number) {
    event?.preventDefault();
    setLoading("login");
    setError(null);
    setProtectedResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/backend/security-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          role,
          ttlSeconds: overrideTtl ?? ttlSeconds,
        }),
      });
      const body = (await response.json()) as ApiResponse<TokenResponse>;
      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message ?? "로그인 실패");
      }
      setLoginResult(body.data);
      setToken(body.data.accessToken);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    } finally {
      setLoading(null);
    }
  }

  async function callProtected(authToken = token) {
    setLoading("protected");
    setError(null);
    setProtectedResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/backend/security-auth/protected?requiredRole=${encodeURIComponent(requiredRole)}`,
        {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        },
      );
      const body = (await response.json()) as ApiResponse<ProtectedResponse>;
      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message ?? "보호 API 호출 실패");
      }
      setProtectedResult(body.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    } finally {
      setLoading(null);
    }
  }

  async function oauthCallback() {
    setLoading("oauth");
    setError(null);
    setOauthResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/backend/security-auth/oauth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", code: "mock-auth-code-1234" }),
      });
      const body = (await response.json()) as ApiResponse<OAuthResponse>;
      if (!response.ok || !body.success || !body.data) {
        throw new Error(body.message ?? "OAuth mock 실패");
      }
      setOauthResult(body.data);
      setLoginResult(body.data.serviceToken);
      setToken(body.data.serviceToken.accessToken);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "알 수 없는 오류");
    } finally {
      setLoading(null);
    }
  }

  function tamperToken() {
    if (!token) {
      setError("먼저 로그인해서 토큰을 발급하세요.");
      return;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      setError("변조할 JWT 형식이 아닙니다.");
      return;
    }
    setToken(`${parts[0]}.${parts[1].slice(0, -2)}xx.${parts[2]}`);
    setError("payload를 변조했습니다. 보호 API를 호출하면 signature 검증이 실패해야 합니다.");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>{studyPage.category} &gt; {studyPage.title}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <section className="rounded-lg border border-violet-200 bg-violet-50/50 p-5 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/20">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="mt-1 size-6 text-violet-700 dark:text-violet-300" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{studyPage.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  로그인, JWT 발급, Bearer token 보호 API, 권한 실패, 토큰 변조,
                  OAuth callback mock을 버튼으로 호출해보는 학습 페이지입니다.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-4">
            {authCards.map(([title, desc, example]) => (
              <article key={title} className="rounded-lg border border-sky-200 bg-sky-50/45 p-4 shadow-sm dark:border-sky-900/60 dark:bg-sky-950/20">
                <KeyRoundIcon className="size-5 text-sky-700 dark:text-sky-300" />
                <h2 className="mt-3 font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
                <p className="mt-3 rounded-md border bg-white/75 p-3 text-xs leading-5 dark:bg-background/45">{example}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
            <form onSubmit={(event) => login(event)} className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="mb-4 flex items-center gap-2">
                <LockKeyholeIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">JWT 로그인 테스트</h2>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm">
                  username
                  <Input value={username} onChange={(event) => setUsername(event.target.value)} />
                </label>
                <label className="grid gap-1 text-sm">
                  password
                  <Input value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>
                <label className="grid gap-1 text-sm">
                  role
                  <Input value={role} onChange={(event) => setRole(event.target.value.toUpperCase())} />
                </label>
                <label className="grid gap-1 text-sm">
                  ttl seconds
                  <Input type="number" value={ttlSeconds} onChange={(event) => setTtlSeconds(Number(event.target.value))} />
                </label>
                <Button type="submit" disabled={loading === "login"}>
                  <PlayIcon className="size-4" />
                  JWT 발급
                </Button>
                <Button type="button" variant="outline" onClick={() => login(undefined, 1)}>
                  1초 만료 토큰 발급
                </Button>
              </div>
            </form>

            <section className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/20">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheckIcon className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold">보호 API 호출</h2>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-1 text-sm">
                  Bearer token
                  <textarea
                    className="min-h-24 rounded-md border bg-background p-3 font-mono text-xs"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  requiredRole
                  <Input value={requiredRole} onChange={(event) => setRequiredRole(event.target.value.toUpperCase())} />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" onClick={() => callProtected()}>
                    <PlayIcon className="size-4" />
                    보호 API 호출
                  </Button>
                  <Button type="button" variant="outline" onClick={tamperToken}>
                    토큰 변조
                  </Button>
                  <Button type="button" variant="outline" onClick={oauthCallback}>
                    <UserRoundIcon className="size-4" />
                    OAuth callback mock
                  </Button>
                </div>
              </div>
            </section>
          </section>

          {error ? (
            <section className="rounded-lg border border-rose-200 bg-rose-50/40 p-4 text-sm leading-6 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/20">
              <div className="flex gap-2">
                <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-rose-700 dark:text-rose-300" />
                <p>{error}</p>
              </div>
            </section>
          ) : null}

          <section className="grid gap-4 xl:grid-cols-3">
            <ResultCard title="로그인 결과" result={loginResult} />
            <ResultCard title="보호 API 결과" result={protectedResult} />
            <ResultCard title="OAuth mock 결과" result={oauthResult} />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Flow title="JWT 흐름" icon={LockKeyholeIcon} steps={loginResult?.steps ?? jwtFlow} />
            <Flow title="OAuth 로그인 흐름" icon={UserRoundIcon} steps={oauthResult?.steps ?? oauthFlow} />
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <Rule title="Access Token" text="짧게 만료시키고 API 인증에 사용합니다. 탈취되면 만료 전까지 악용될 수 있습니다." />
            <Rule title="Refresh Token" text="길게 유지하되 DB/Redis에 저장해 폐기할 수 있게 설계합니다." />
            <Rule title="권한 검사는 서버에서" text="프론트에서 버튼을 숨겨도 API 권한 검사를 반드시 서버에서 다시 해야 합니다." />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Flow({ title, icon: Icon, steps }: { title: string; icon: typeof LockKeyholeIcon; steps: string[] }) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex items-center gap-2">
            <div className="rounded-lg border bg-white/75 px-3 py-2 text-sm dark:bg-background/45">{index + 1}. {step}</div>
            {index < steps.length - 1 ? <ArrowRightIcon className="size-4 text-muted-foreground" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function Rule({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-amber-200 bg-amber-50/45 p-4 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="flex items-center gap-2">
        <CheckCircle2Icon className="size-4 text-amber-700 dark:text-amber-300" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </article>
  );
}

function ResultCard({ title, result }: { title: string; result: unknown }) {
  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      {result ? (
        <pre className="mt-3 max-h-96 overflow-auto rounded-md border bg-background p-3 text-xs leading-5">
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">아직 결과가 없습니다.</p>
      )}
    </section>
  );
}
