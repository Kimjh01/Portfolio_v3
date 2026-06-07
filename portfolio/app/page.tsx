"use client";

import Image from "next/image";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ProjectLink = {
  label: string;
  href: string;
};

type TechLevel = "활용" | "구현" | "주도";
type SkillLevel = "상" | "상중" | "중" | "중하" | "하";

type TechAbility = {
  name: string;
  icon: string;
  iconUrl?: string;
  level: TechLevel;
  evidence: string;
};

type TroubleshootingItem = {
  title: string;
  problem: string;
  solution: string;
  result: string;
};

type Project = {
  id: string;
  title: string;
  type: string;
  role: string;
  period: string;
  image: string;
  detailImage: string;
  summary: string;
  overview: string;
  metric: string;
  metricLabel: string;
  focus: string[];
  myWork: string[];
  troubleshooting: TroubleshootingItem[];
  tech: TechAbility[];
  links: ProjectLink[];
};

type SkillCard = Omit<TechAbility, "level"> & {
  group: string;
  level: SkillLevel;
  tools?: string[];
};

const projects: Project[] = [
  {
    id: "mom",
    title: "MoM",
    type: "AI Healthcare",
    role: "AI / Hardware",
    period: "2026.04 - 2026.06",
    image: "/mom_background.png",
    detailImage: "/mom_detail.png",
    summary:
      "스마트폰 360도 영상으로 3D 아바타, 신체 치수, 운동 자세 피드백을 연결한 서비스.",
    overview:
      "스마트폰 360도 촬영 기반 개인 3D 아바타 생성 서비스. 신체 치수 산출과 운동 피드백까지 연결",
    metric: "90% / 93%",
    metricLabel: "추론 시간 단축 / SPZ 경량화",
    focus: ["촬영 품질 안정화", "3DGS 후처리", "SMPL 치수 보정"],
    myWork: [
      "회전 촬영 구조 설계로 360도 데이터 품질 안정화",
      "YOLO/SAM2 기반 인물 분리와 3DGS 학습용 마스크 데이터 구성",
      "SMPL 결과를 실제 cm 단위 치수로 보정하는 scale 흐름 정리",
    ],
    troubleshooting: [
      {
        title: "촬영 궤도 흔들림으로 인한 3DGS 품질 저하",
        problem: "수동 촬영 중 카메라 궤도 흔들림. 외곽 깨짐과 배경 잔상 발생",
        solution: "회전 촬영 거치대 제작. 불량 프레임 제거로 학습 데이터 정제",
        result: "분석 시간 90% 단축. 모바일 렌더링용 SPZ 경량화 연결",
      },
      {
        title: "SMPL 좌표계와 실제 치수 불일치",
        problem: "SMPL unit 좌표계와 실제 cm 단위 치수 불일치",
        solution: "사용자 키 기준 scale factor 계산. 메시 전체에 일괄 적용",
        result: "보정 메시 기준 주요 신체 치수 재산출 가능",
      },
    ],
    tech: [
      {
        name: "3DGS",
        icon: "3D",
        level: "구현",
        evidence: "전처리, 노이즈 제거, SPZ 압축 흐름 연결",
      },
      {
        name: "SMPL",
        icon: "SM",
        level: "활용",
        evidence: "키 기준 scale factor로 실제 치수 산출 구조 설계",
      },
      {
        name: "YOLO / SAM2",
        icon: "CV",
        level: "활용",
        evidence: "인물 분리와 마스크 데이터 구성에 적용",
      },
    ],
    links: [{ label: "Live Demo", href: "https://modelofme.vercel.app" }],
  },
  {
    id: "waddoc",
    title: "Waddoc",
    type: "Digital Twin",
    role: "Digital Twin / MQTT",
    period: "2026.02 - 2026.04",
    image: "/waddoc_background.png",
    detailImage: "/waddoc_detail.png",
    summary:
      "방문형 비대면 진료 로봇을 위한 Unity 디지털 트윈과 차량 관제 흐름.",
    overview:
      "의료취약지 방문 진료 로봇 관제용 디지털 트윈. 차량 상태 시각화, 원격 명령, E-Stop 흐름 검증",
    metric: "160 -> 14 msg/s",
    metricLabel: "MQTT topic 분리 후 메시지 구조 개선",
    focus: ["Unity 관제 화면", "MQTT topic 재설계", "차량 물리 모델"],
    myWork: [
      "Unity 기반 관제용 디지털 트윈 화면 구성",
      "telemetry와 command를 분리하는 MQTT topic tree 설계",
      "Rigidbody와 WheelCollider 기반 조향, 제동, 서스펜션 반응 구현",
    ],
    troubleshooting: [
      {
        title: "상태와 명령이 섞여 메시지 처리량 증가",
        problem: "차량 상태와 제어 명령 혼재. 갱신 메시지 과다 발생",
        solution: "MQTT topic을 telemetry와 command로 분리. E-Stop 별도 채널 독립",
        result: "차량 1대 기준 160 msg/s에서 14 msg/s 수준으로 감소",
      },
      {
        title: "단순 이동 모델의 차량 반응 한계",
        problem: "Kinematic 방식만으로 조향, 제동, 접지 반응 표현 한계",
        solution: "Bicycle Model 입력을 Unity 물리 기반 WheelCollider 이동으로 변환",
        result: "관제 화면 내 차량 움직임과 정지 반응 자연도 개선",
      },
    ],
    tech: [
      {
        name: "Unity",
        icon: "U",
        level: "구현",
        evidence: "주행 환경과 관제 화면을 디지털 트윈으로 구성",
      },
      {
        name: "MQTT",
        icon: "MQ",
        level: "주도",
        evidence: "topic tree 재설계로 상태와 명령 분리",
      },
      {
        name: "Vehicle Dynamics",
        icon: "VD",
        level: "구현",
        evidence: "조향, 제동, 서스펜션 반응을 물리 기반으로 반영",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Kimjh01/waddoc" },
      { label: "Live Demo", href: "https://waddoc.vercel.app" },
    ],
  },
  {
    id: "palletizer",
    title: "Palletizer",
    type: "Robotics Simulation",
    role: "ROS2 / Navigation",
    period: "2026.01 - 2026.02",
    image: "/Palletizer_background.png",
    detailImage: "/Palletizer_detail.png",
    summary:
      "ROS2와 Gazebo에서 팔레타이징 로봇의 접근, 정렬, 정지 판단을 통합.",
    overview:
      "공장 물류 자동화용 팔레타이징 로봇 시뮬레이션. 주행, 팔레트 접근, 정렬, 작업 전 정지 판단 연결",
    metric: "10~15deg -> 3~5deg",
    metricLabel: "팔레트 heading 오차 개선 목표",
    focus: ["Nav2 주행", "LiDAR 정렬", "상태 기반 전환"],
    myWork: [
      "Cartographer와 Nav2 기반 자율주행 흐름 구성",
      "LiDAR와 Canny Edge 기반 팔레트 중심 및 heading 보정",
      "Approach, Align, Stop Confirm 단계로 로봇 동작 전환 분리",
    ],
    troubleshooting: [
      {
        title: "좌표는 맞지만 heading이 틀어지는 문제",
        problem: "목표 위치 도달 후 heading 오차 잔류. 팔레트 정렬 실패",
        solution: "LiDAR로 팔레트 폭과 중심 추정. Canny Edge로 정면 방향 보정",
        result: "heading 오차 10~15deg에서 3~5deg 목표 수준으로 개선",
      },
      {
        title: "작업 전 정지 판단 불안정",
        problem: "목표 도달 후 미세 속도와 회전 잔류. 작업 시작 타이밍 불안정",
        solution: "거리, 선속도, 각속도를 함께 확인하는 Stop Confirm 조건 추가",
        result: "주행 단계와 작업 단계 전환 기준 명확화",
      },
    ],
    tech: [
      {
        name: "ROS2 / Nav2",
        icon: "ROS",
        level: "구현",
        evidence: "주행, 목표 접근, 상태 전환 흐름 직접 구성",
      },
      {
        name: "Gazebo",
        icon: "GZ",
        level: "활용",
        evidence: "팔레트, 로봇팔, 장애물 포함 검증 환경 구성",
      },
      {
        name: "LiDAR",
        icon: "LD",
        level: "활용",
        evidence: "팔레트 폭과 중심 추정 정렬 로직에 사용",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Kimjh01/Palletizer" },
      { label: "Live Demo", href: "https://palletizer-liart.vercel.app" },
    ],
  },
  {
    id: "mylituniverse",
    title: "MyLitUniverse",
    type: "AI Book Discovery",
    role: "AI / Frontend / 3D",
    period: "2025.11 - 2025.12",
    image: "/mylituniverse_background.png",
    detailImage: "/mylituniverse_detail.png",
    summary:
      "도서 의미 관계를 3D 공간에 시각화하고 경량화된 RAG 분석 경험을 구현.",
    overview:
      "도서 간 의미 관계를 3D 공간에서 탐색하는 AI 도서 플랫폼. RAG 기반 분석 결과를 안정적으로 제공",
    metric: "1,000+ / -70%",
    metricLabel: "도서 시각화 / RAG 토큰 절감",
    focus: ["Doc2Vec 의미 좌표화", "Three.js 최적화", "JSON 응답 안정화"],
    myWork: [
      "Doc2Vec 기반 도서 임베딩과 의미 좌표화 흐름 구성",
      "Three.js로 1,000권 이상 도서 배치 및 렌더링 성능 조정",
      "LLM 응답을 JSON schema로 제한해 UI 렌더링 안정성 개선",
    ],
    troubleshooting: [
      {
        title: "3D 도서 탐색 초기 로딩 부담",
        problem: "도서 상세 데이터 동시 로딩으로 초기 화면과 카메라 조작 무거움",
        solution: "초기 payload를 좌표와 카테고리 중심으로 축소. 상세 데이터 lazy loading 분리",
        result: "초기 탐색 화면 응답성과 조작감 개선",
      },
      {
        title: "RAG 요청 토큰 과다",
        problem: "유사 도서 설명 전체 포함으로 요청 토큰 5,000 수준까지 증가",
        solution: "Top-3 제한과 compact schema 적용",
        result: "요청 토큰 약 70% 절감. 응답 안정성 개선",
      },
    ],
    tech: [
      {
        name: "Three.js",
        icon: "3JS",
        level: "구현",
        evidence: "1,000권 이상 도서를 3D 공간에 배치하고 최적화",
      },
      {
        name: "Doc2Vec",
        icon: "D2V",
        level: "활용",
        evidence: "도서 추천과 의미 좌표화를 위한 임베딩 구성",
      },
      {
        name: "RAG",
        icon: "RAG",
        level: "활용",
        evidence: "Top-3와 compact schema로 토큰 사용량 절감",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Kimjh01/MyLitUniverse" },
      { label: "Live Demo", href: "https://mylituniverse.vercel.app" },
    ],
  },
  {
    id: "iomeal",
    title: "IOMEAL",
    type: "On-device AI",
    role: "Edge AI / Backend",
    period: "2024.06 - 2024.10",
    image: "/iomeal_background.png",
    detailImage: "/iomeal_detail.png",
    summary:
      "Raspberry Pi 기반 스마트 냉장고에서 식재료 인식, OCR 등록, 추천 흐름을 설계.",
    overview:
      "Raspberry Pi 기반 스마트 냉장고 시스템. 식재료 인식, OCR 등록, 유통기한 기반 추천 연결",
    metric: "0.3~1s / -70%",
    metricLabel: "rule 추천 응답 / LLM 호출 감소",
    focus: ["YOLO + OCR 등록", "식품 DB 관리", "Rule / LLM 분리"],
    myWork: [
      "Raspberry Pi 환경에서 카메라 인식과 터치스크린 입력 흐름 검증",
      "YOLO, OCR, 사용자 확인을 조합한 식재료 등록 UX 구성",
      "Django 기반 FoodItem 저장, 유통기한 계산, 추천 API 구현",
    ],
    troubleshooting: [
      {
        title: "온디바이스 LLM 지연과 발열",
        problem: "Raspberry Pi 로컬 LLM 추천 실행 시 응답 25~40초까지 지연",
        solution: "유통기한, 알레르기, 보관 판단은 rule/cache 처리. 생성형 추천만 조건부 LLM 호출",
        result: "rule 추천 0.3~1초 처리. LLM 호출 60~70% 감소",
      },
      {
        title: "포장/겹침으로 인한 식재료 인식 불안정",
        problem: "포장 상태와 겹침으로 confidence 낮은 객체 반복 발생",
        solution: "YOLO 자동 인식, OCR/바코드, 사용자 수정 입력 동시 제공",
        result: "자동 등록과 확인 등록 분리. 데이터 신뢰도 개선",
      },
    ],
    tech: [
      {
        name: "Raspberry Pi",
        icon: "PI",
        level: "구현",
        evidence: "터치스크린 환경에서 엣지 AI 흐름 검증",
      },
      {
        name: "Python",
        icon: "PY",
        level: "구현",
        evidence: "인식, OCR 처리, 추천 로직을 파이프라인으로 구성",
      },
      {
        name: "Django",
        icon: "DJ",
        level: "구현",
        evidence: "FoodItem 저장, 유통기한 계산, 추천 API 구성",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Kimjh01/AI_Refrigerator" },
      { label: "Live Demo", href: "https://iomeal.vercel.app" },
    ],
  },
];

const skillCards: SkillCard[] = [
  {
    group: "Language",
    name: "Python",
    icon: "PY",
    iconUrl: "https://cdn.simpleicons.org/python/102A43",
    level: "상중",
    evidence: "AI 추론, OCR, 백엔드 API, 데이터 처리 파이프라인 구현",
  },
  {
    group: "Language",
    name: "C / C++",
    icon: "C++",
    iconUrl: "https://cdn.simpleicons.org/cplusplus/102A43",
    level: "중",
    evidence: "임베디드 제어와 로봇/센서 연동 로직 해석 및 수정 가능",
  },
  {
    group: "Robotics",
    name: "ROS 1/2",
    icon: "ROS",
    iconUrl: "https://cdn.simpleicons.org/ros/102A43",
    level: "상중",
    evidence: "ROS1/ROS2 기반 주행, 토픽, 상태 전환 구성",
    tools: ["ROS1", "ROS2", "Nav2", "Gazebo"],
  },
  {
    group: "System",
    name: "Linux",
    icon: "LX",
    iconUrl: "https://cdn.simpleicons.org/linux/102A43",
    level: "상중",
    evidence: "개발 환경 세팅, 패키지 빌드, 장치 연결 문제 처리",
  },
  {
    group: "AI",
    name: "AI / Vision",
    icon: "AI",
    iconUrl: "https://cdn.simpleicons.org/opencv/102A43",
    level: "중",
    evidence: "YOLO, SAM2, OCR, RAG를 프로젝트 목적에 맞게 조합",
    tools: ["YOLO", "SAM2", "OCR", "RAG"],
  },
  {
    group: "Simulation",
    name: "Unity",
    icon: "U",
    iconUrl: "https://cdn.simpleicons.org/unity/102A43",
    level: "중",
    evidence: "관제용 디지털 트윈과 차량 물리 시뮬레이션 구성",
  },
  {
    group: "Edge",
    name: "Edge Devices",
    icon: "JET",
    iconUrl: "https://cdn.simpleicons.org/nvidia/102A43",
    level: "상중",
    evidence: "Raspberry Pi, Arduino, Jetson Xavier/Orin/Nano 사용 경험",
    tools: ["Raspberry Pi", "Arduino", "Jetson Xavier", "Orin", "Nano"],
  },
  {
    group: "CAD",
    name: "Inventor",
    icon: "CAD",
    iconUrl: "https://cdn.simpleicons.org/autodesk/102A43",
    level: "중하",
    evidence: "기구/브라켓 설계와 제작 검토용 모델링 가능",
  },
];

const profileFacts = [
  { label: "Location", value: "Seoul, South Korea", icon: "⌖" },
  { label: "Experience", value: "AI · Robotics · 3D", icon: "◷" },
  { label: "Email", value: "felix3328@naver.com", icon: "✉" },
  { label: "Availability", value: "Open to work", icon: "✦" },
];

const slideIds = ["home", "projects", "about", "skills", "contact"];

function useHorizontalSectionScroll(panelCount: number) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const syncActive = () => {
      const nextIndex = Math.round(rail.scrollLeft / rail.clientWidth);
      setActiveIndex(Math.min(panelCount - 1, Math.max(0, nextIndex)));
    };

    const handleWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 980) {
        return;
      }

      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      rail.scrollBy({ left: event.deltaY, top: 0, behavior: "smooth" });
    };

    syncActive();
    rail.addEventListener("scroll", syncActive, { passive: true });
    rail.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      rail.removeEventListener("scroll", syncActive);
      rail.removeEventListener("wheel", handleWheel);
    };
  }, [panelCount]);

  const scrollToIndex = (index: number) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollTo({
      left: rail.clientWidth * Math.min(panelCount - 1, Math.max(0, index)),
      behavior: "smooth",
    });
  };

  return { activeIndex, railRef, scrollToIndex };
}

function PageNav({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number;
  onNavigate: (index: number) => void;
}) {
  return (
    <header className="nav">
      <button type="button" className="brand" onClick={() => onNavigate(0)}>
        JUHO.
      </button>
      <nav>
        {["Home", "Projects", "About", "Skills", "Contact"].map(
          (label, index) => (
            <button
              key={label}
              type="button"
              aria-current={activeIndex === index ? "page" : undefined}
              onClick={() => onNavigate(index)}
            >
              {label}
            </button>
          )
        )}
      </nav>
      <div className="navActions">
        <a
          className="navIcon githubIcon"
          href="https://github.com/Kimjh01"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <svg viewBox="-2 -2 20 20" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.67 0 8.23c0 3.64 2.29 6.73 5.47 7.82.4.08.55-.18.55-.4 0-.2-.01-.86-.01-1.56-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.16-.28-.15-.68-.52-.01-.53.63-.01 1.08.6 1.23.85.72 1.24 1.87.89 2.33.68.07-.54.28-.89.51-1.1-1.78-.21-3.64-.92-3.64-4.08 0-.9.31-1.64.82-2.22-.08-.21-.36-1.05.08-2.19 0 0 .67-.22 2.2.85A7.4 7.4 0 0 1 8 3.96c.68 0 1.36.09 2 .27 1.52-1.07 2.19-.85 2.19-.85.44 1.14.16 1.98.08 2.19.51.58.82 1.32.82 2.22 0 3.17-1.87 3.87-3.65 4.08.29.26.54.76.54 1.54 0 1.11-.01 2-.01 2.28 0 .22.15.48.55.4A8.18 8.18 0 0 0 16 8.23C16 3.67 12.42 0 8 0Z" />
          </svg>
        </a>
        <a className="navIcon" href="mailto:felix3328@naver.com" aria-label="Mail">
          <svg className="strokeIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.5 6.5h15a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2Z" />
            <path d="m4 8 8 5.8L20 8" />
          </svg>
        </a>
      </div>
    </header>
  );
}

function HeroSection({ onNavigate }: { onNavigate: (index: number) => void }) {
  return (
    <section id="home" className="hero section horizontalSlide">
      <div className="scrollMark">
        <span>SCROLL</span>
        <i />
      </div>

      <div className="heroText">
        <h1>
          Hello,
          <br />
          I&apos;m <span>Juho</span>
        </h1>
        <p>
          현실에서 움직이는 로봇, AI, 3D 시스템을 깔끔한 제품 흐름으로
          연결합니다.
        </p>
        <button
          type="button"
          className="pillButton"
          onClick={() => onNavigate(1)}
        >
          View My Work <span>↗</span>
        </button>
      </div>

      <HeroVisual />

    </section>
  );
}

function HeroVisual() {
  return (
    <div className="heroVisual embeddedVisual" aria-hidden="true">
      <div className="signalAntenna">
        <span />
        <span />
        <span />
      </div>
      <div className="embeddedBoard">
        <span className="boardLabel">EMBEDDED</span>
        <div className="pinRail pinRailLeft">
          {Array.from({ length: 6 }).map((_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className="pinRail pinRailRight">
          {Array.from({ length: 6 }).map((_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className="chip">
          <span>MCU</span>
          {Array.from({ length: 16 }).map((_, index) => (
            <i key={index} />
          ))}
        </div>
        <span className="trace traceA" />
        <span className="trace traceB" />
        <span className="trace traceC" />
        <span className="trace traceD" />
        <div className="sensorBlock">IMU</div>
        <div className="portBlock">GPIO</div>
        <div className="boardPorts">
          <span>UART</span>
          <span>I2C</span>
          <span>SPI</span>
        </div>
      </div>
      <div className="firmwarePanel">
        <span className="codeIcon">&lt;/&gt;</span>
        <strong>sensor.read()</strong>
        <small>{"GPIO -> ROS2 -> UI"}</small>
        <i />
        <i />
        <i />
      </div>
      <div className="telemetryPanel">
        <span>LIVE BUS</span>
        <strong>24.8ms</strong>
        <i />
        <i />
      </div>
      <div className="heroCursor">↖</div>
    </div>
  );
}

function ProjectsSection({
  onSelectProject,
}: {
  onSelectProject: (project: Project) => void;
}) {
  const [offset, setOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const carouselProjects = useMemo(() => [...projects, ...projects], []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTransitionEnabled(true);
      setOffset((current) => current + 1);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (offset !== projects.length) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setTransitionEnabled(false);
      setOffset(0);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTransitionEnabled(true));
      });
    }, 620);

    return () => window.clearTimeout(resetTimer);
  }, [offset]);

  const move = (direction: 1 | -1) => {
    setOffset((current) => {
      setTransitionEnabled(true);

      if (direction === -1 && current === 0) {
        return projects.length - 1;
      }

      return current + direction;
    });
  };

  return (
    <section id="projects" className="projects section darkSection horizontalSlide">
      <div className="sectionTop">
        <div>
          <span>02</span>
          <h2>Projects</h2>
        </div>
        <a href="#contact">View All Projects →</a>
      </div>

      <div className="projectCarousel">
        <div
          className={`projectCards ${transitionEnabled ? "" : "noTransition"}`}
          style={
            {
              "--project-offset": offset,
            } as CSSProperties
          }
        >
          {carouselProjects.map((project, index) => (
            <ProjectCard
              key={`${project.id}-${index}`}
              project={project}
              index={index % projects.length}
              onSelect={() => onSelectProject(project)}
            />
          ))}
        </div>
      </div>

      <div className="carouselControls">
        <button type="button" aria-label="Previous project" onClick={() => move(-1)}>
          ←
        </button>
        <button type="button" aria-label="Next project" onClick={() => move(1)}>
          →
        </button>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: () => void;
}) {
  return (
    <article
      className="projectCard"
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="projectThumb">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 900px) 100vw, 30vw"
          className="thumbImage"
        />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="projectBody">
        <div className="projectName">
          <h3>{project.title}</h3>
          <em>{project.type}</em>
        </div>
        <p>{project.summary}</p>
        <strong>{project.metric}</strong>
        <div className="projectLinks">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function AboutSection({ onNavigate }: { onNavigate: (index: number) => void }) {
  return (
    <section id="about" className="about section horizontalSlide">
      <div className="sectionIntro">
        <span>03</span>
        <h2>About Me</h2>
        <p>
          센서, 모델, 화면이 따로 놀지 않도록 하나의 흐름으로 묶는 개발을
          좋아합니다. 문제를 작게 쪼개고, 결과가 실제 환경에서 동작하는지까지
          확인합니다.
        </p>
        <button
          type="button"
          className="pillButton"
          onClick={() => onNavigate(3)}
        >
          More About Me <span>↗</span>
        </button>
      </div>

      <div className="factList">
        {profileFacts.map((fact) => (
          <div key={fact.label} className="factItem">
            <span>{fact.icon}</span>
            <div>
              <strong>{fact.label}</strong>
              <p>{fact.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="aboutPhoto">
        <Image
          src="/me.jpg"
          alt="김주호"
          fill
          sizes="(max-width: 900px) 100vw, 320px"
          className="aboutImage"
        />
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="skills section horizontalSlide">
      <div className="sectionTop lightTop">
        <div>
          <span>04</span>
          <h2>Skills</h2>
        </div>
      </div>
      <div className="skillGrid">
        {skillCards.map((skill) => (
          <TechCard key={`${skill.group}-${skill.name}`} tech={skill} />
        ))}
      </div>
    </section>
  );
}

function TechCard({ tech }: { tech: SkillCard | TechAbility }) {
  const tools = "tools" in tech ? tech.tools : undefined;

  return (
    <article className="techCard">
      <div className="techIcon">
        {tech.iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tech.iconUrl} alt="" aria-hidden="true" />
        ) : (
          tech.icon
        )}
      </div>
      <div className="techContent">
        <div className="techHeader">
          <div>
            {"group" in tech && <span className="techGroup">{tech.group}</span>}
            <h3>{tech.name}</h3>
          </div>
          <strong aria-label={`숙련도 ${tech.level}`}>{tech.level}</strong>
        </div>
        <p>{tech.evidence}</p>
        {tools && (
          <div className="techTags">
            {tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="cta horizontalSlide">
      <div>
        <span>✦</span>
        <h2>
          Let&apos;s build something
          <br />
          amazing <em>together</em>
        </h2>
      </div>
      <a href="mailto:felix3328@naver.com">
        Get In Touch <span>↗</span>
      </a>
    </section>
  );
}

function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="detailOverlay" role="dialog" aria-modal="true">
      <button
        type="button"
        className="detailBackdrop"
        aria-label="Close project detail"
        onClick={onClose}
      />
      <article className="detailPanel" style={{ backgroundColor: "#ffffff" }}>
        <button type="button" className="detailClose" onClick={onClose}>
          ×
        </button>
        <div className="detailImage">
          <Image
            src={project.detailImage}
            alt={project.title}
            fill
            sizes="(max-width: 980px) 100vw, 520px"
            className="thumbImage"
          />
        </div>
        <div className="detailContent" style={{ backgroundColor: "#ffffff" }}>
          <span>{project.type}</span>
          <h2>{project.title}</h2>
          <div className="projectLinks detailLinks">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label} ↗
              </a>
            ))}
          </div>
          <section className="detailSection">
            <h3>프로젝트 개요</h3>
            <p>{project.overview}</p>
          </section>
          <section className="detailSection">
            <h3>내가 한 일</h3>
            <ul>
              {project.myWork.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <div className="detailMetric">
            <strong>{project.metric}</strong>
            <em>{project.metricLabel}</em>
          </div>
          <div className="detailGrid">
            {project.focus.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
          <section className="detailSection troubleshootingSection">
            <h3>트러블 슈팅</h3>
            {project.troubleshooting.map((item) => (
              <article key={item.title}>
                <strong>{item.title}</strong>
                <p>
                  <b>Problem</b>
                  <span>{item.problem}</span>
                </p>
                <p>
                  <b>Solution</b>
                  <span>{item.solution}</span>
                </p>
                <em>
                  <b>Result</b>
                  <span>{item.result}</span>
                </em>
              </article>
            ))}
          </section>
          <div className="detailTech">
            {project.tech.map((tech) => (
              <TechCard key={`${project.id}-detail-${tech.name}`} tech={tech} />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Page() {
  const { activeIndex, railRef, scrollToIndex } =
    useHorizontalSectionScroll(slideIds.length);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main>
      <PageNav activeIndex={activeIndex} onNavigate={scrollToIndex} />
      <div ref={railRef} className="horizontalPage">
        <HeroSection onNavigate={scrollToIndex} />
        <ProjectsSection onSelectProject={setSelectedProject} />
        <AboutSection onNavigate={scrollToIndex} />
        <SkillsSection />
        <ContactSection />
      </div>
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
}
