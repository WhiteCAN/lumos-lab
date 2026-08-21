import {
  CableIcon,
  CheckCircle2Icon,
  Gamepad2Icon,
  MailIcon,
  MonitorIcon,
  RadioTowerIcon,
  SendIcon,
  ServerIcon,
  ShieldCheckIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import type {
  HeaderFieldGroup,
  ProtocolComparison,
  ProtocolIntro,
  ProtocolUseCase,
} from "@/types/tcp-vs-udp";

export const protocolIntros: ProtocolIntro[] = [
  {
    name: "TCP",
    fullName: "Transmission Control Protocol",
    summary:
      "연결 지향 프로토콜입니다. 데이터를 순서대로, 안정적으로 전달하기 위해 확인 응답과 재전송, 흐름 제어를 사용합니다.",
    keyPoints: [
      "연결 지향",
      "신뢰성 있는 전달",
      "순서 보장",
      "오류 및 흐름 제어",
      "UDP보다 상대적으로 느림",
    ],
    colorClass:
      "border-blue-200 bg-blue-50/70 dark:border-blue-900/70 dark:bg-blue-950/30",
    icon: ShieldCheckIcon,
  },
  {
    name: "UDP",
    fullName: "User Datagram Protocol",
    summary:
      "비연결형 프로토콜입니다. 전달 보장을 줄이는 대신 빠르고 가볍게 데이터를 전송합니다.",
    keyPoints: [
      "비연결형",
      "최선 노력 전달",
      "확인 응답 없음",
      "TCP보다 빠름",
      "오류 및 흐름 제어 없음",
    ],
    colorClass:
      "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/70 dark:bg-emerald-950/30",
    icon: ZapIcon,
  },
];

export const protocolComparisons: ProtocolComparison[] = [
  { feature: "연결 방식", tcp: "연결 지향", udp: "비연결형" },
  { feature: "신뢰성", tcp: "높음", udp: "최선 노력" },
  { feature: "데이터 전달", tcp: "순서 보장", udp: "순서 보장 없음" },
  { feature: "오류 제어", tcp: "있음", udp: "없음" },
  { feature: "흐름 제어", tcp: "있음", udp: "없음" },
  { feature: "속도", tcp: "상대적으로 느림", udp: "빠름" },
  { feature: "헤더 크기", tcp: "20~60 bytes", udp: "8 bytes" },
  { feature: "대표 사용", tcp: "웹, 이메일, 파일 전송", udp: "스트리밍, 게임, DNS" },
];

export const tcpHandshake = [
  "클라이언트가 SYN을 보냅니다.",
  "서버가 SYN-ACK로 응답합니다.",
  "클라이언트가 ACK를 보내 연결을 확정합니다.",
  "연결이 성립된 뒤 데이터를 전송합니다.",
];

export const udpFlow = [
  "별도 연결을 만들지 않습니다.",
  "보내는 쪽이 데이터를 바로 전송합니다.",
  "수신 확인이나 재전송을 기본으로 보장하지 않습니다.",
  "속도가 중요한 상황에 적합합니다.",
];

export const protocolUseCases: ProtocolUseCase[] = [
  {
    protocol: "TCP",
    items: [
      "웹 브라우징 HTTP/HTTPS",
      "이메일 SMTP, IMAP, POP3",
      "파일 전송 FTP",
      "원격 접속 SSH, Telnet",
      "데이터베이스 연결",
    ],
  },
  {
    protocol: "UDP",
    items: [
      "영상 스트리밍",
      "온라인 게임",
      "VoIP 통화",
      "DNS 질의",
      "라이브 방송",
    ],
  },
];

export const headerFields: HeaderFieldGroup[] = [
  {
    title: "TCP Header",
    fields: [
      "Source Port",
      "Destination Port",
      "Sequence Number",
      "Acknowledgment Number",
      "Flags",
      "Window Size",
      "Checksum",
      "Options",
    ],
    colorClass:
      "border-blue-200 bg-blue-50/70 dark:border-blue-900/70 dark:bg-blue-950/30",
  },
  {
    title: "UDP Header",
    fields: ["Source Port", "Destination Port", "Length", "Checksum"],
    colorClass:
      "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/70 dark:bg-emerald-950/30",
  },
];

export const tcpBenefits = [
  "신뢰성 있는 데이터 전송",
  "순서 보장",
  "오류 및 흐름 제어",
  "중요한 데이터에 적합",
];

export const udpBenefits = [
  "매우 빠름",
  "낮은 오버헤드",
  "실시간 앱에 효율적",
  "단순하고 가벼움",
];

export const tcpUdpAnalogy = [
  {
    title: "TCP",
    description: "택배처럼 확인하고 추적하며 안전하게 전달합니다.",
    icon: CheckCircle2Icon,
    colorClass:
      "border-blue-200 bg-blue-50/70 dark:border-blue-900/70 dark:bg-blue-950/30",
  },
  {
    title: "UDP",
    description: "오토바이 퀵처럼 빠르게 보내지만 도착 보장은 약합니다.",
    icon: SendIcon,
    colorClass:
      "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/70 dark:bg-emerald-950/30",
  },
];

export const tcpUdpSummary =
  "TCP = 신뢰성 있고 순서 있는 전달, UDP = 빠르고 가벼운 전달";

export const useCaseIcons = {
  web: MonitorIcon,
  server: ServerIcon,
  game: Gamepad2Icon,
  video: VideoIcon,
  mail: MailIcon,
  network: RadioTowerIcon,
  cable: CableIcon,
};
