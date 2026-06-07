# 김주호 포트폴리오 프로젝트 정리

> 사이트 제작용 Markdown 원본입니다.  
> `project-frontend`는 Live Demo 링크용으로만 사용하고, 프로젝트 설명은 각 원본 프로젝트 기준으로 정리합니다.

---

## Profile Summary

**코드가 현실에서 움직이는 순간을 만드는 개발자 김주호입니다.**

ROS, AI 자율주행, 3D 시뮬레이션, 하드웨어 연동을 중심으로 프로젝트를 수행해왔습니다. 단순 웹 서비스보다 실제 센서, 로봇, 엣지 디바이스, 차량 시뮬레이션처럼 현실 환경과 연결되는 시스템을 만드는 데 관심이 있습니다.

---

## Project Order Recommendation

1. **MoM / Model of Me**  
   AI + 3D Reconstruction + Hardware
2. **Waddoc**  
   Unity Digital Twin + Vehicle Dynamics + MQTT Control
3. **Palletizer**  
   ROS2 + Gazebo + Robot Navigation
4. **MyLitUniverse**  
   AI Recommendation + 3D Visualization + Frontend
5. **AI_Refrigerator / IOMEAL**  
   On-device AI + Backend + IoT

---

# 1. MoM / Model of Me

## Overview

**스마트폰 360도 영상만으로 개인 3D 아바타를 생성하고, 신체 치수 측정과 운동 자세 피드백을 제공하는 3D 헬스케어 서비스**

MoM은 별도 장비 없이 스마트폰으로 촬영한 360도 영상을 기반으로 개인 3D 아바타를 생성하는 모바일 헬스케어 서비스입니다. 3D Gaussian Splatting과 SMPL을 활용해 사용자 신체를 재구성하고, 주요 신체 치수를 산출합니다. 이후 측정 데이터를 기반으로 운동을 추천하고, MediaPipe 기반 온디바이스 포즈 분석을 통해 운동 중 자세를 실시간으로 피드백합니다.

## Role

**AI / Hardware**

## Period

**2026.04 ~ 2026.06**

## Tech Stack

- Flutter
- 3DGS
- SMPL
- SAM2
- YOLO
- MediaPipe
- API Server
- PostgreSQL
- AWS S3
- RabbitMQ

## My Work

- 3DGS 학습을 위한 영상 전처리 및 데이터 품질 관리
- YOLO/SAM2 기반 인물 분리 및 마스크 데이터 구성
- SMPL 신체 치수 측정 파이프라인 설계 참여
- 안정적인 360도 촬영을 위한 회전 촬영 하드웨어 제작
- 촬영 흔들림, 거리 변화, 카메라 궤도 불안정 문제 개선
- 3DGS 결과의 artifact 분석 및 후처리 방향 설계

## Key Points

- 스마트폰 360도 영상 기반 3D 아바타 생성
- 3DGS + SMPL 기반 신체 치수 측정
- 회전 촬영 하드웨어를 통한 촬영 품질 안정화
- MediaPipe 기반 운동 자세 피드백
- 모델 추론 시간 90% 단축
- PLY → SPZ 변환으로 렌더링 파일 크기 93% 경량화

## Troubleshooting 1. 촬영 데이터 품질 안정화를 위한 하드웨어 구조 개선

### 문제

수동 촬영/지면 접촉형 구조에서는 카메라 궤도가 흔들려 약 **100개 학습 프레임** 중 품질 저하 프레임이 섞였고, 3DGS 결과에 외곽 깨짐과 배경 잔상이 발생했습니다.

### 원인

3DGS는 다중 시점 정합성이 중요한데, 촬영 반지름·높이·피사체 중심이 일정하지 않았습니다.

### 해결

공중 지지형 회전 촬영 거치대로 카메라 궤도를 안정화하고, 전신 누락·흔들림·조명 불량 프레임을 제외했습니다. 최종적으로 **분석 시간 90% 단축**, **PLY → SPZ 변환으로 파일 크기 93% 절감**을 달성했습니다.

### 추천 이미지

- 촬영 궤도 안정화 전/후 비교 그래프
- 지면 접촉형 vs 공중 지지형 회전 촬영 거치대 비교
- 3D Trajectory Comparison 이미지

---

## Troubleshooting 2. 3D 모델 후처리 및 모바일 렌더링 경량화

### 문제

마스크 경계 흔들림으로 3DGS 결과에 바닥·배경 Gaussian과 검은 외곽 노이즈가 남았습니다.

### 원인

SAM2 마스크가 프레임마다 완전히 일관되지 않아 배경/그림자 일부가 Gaussian으로 누적되었습니다.

### 해결

마스크 재투영과 contour 기준 후처리로 신체 외부 Gaussian을 제거했습니다. 최종 모델은 모바일 뷰어용 SPZ로 압축해 로딩 부담을 **93% 감소**시켰습니다.

### 추천 이미지

- 3DGS 결과 Point Cloud → Mask(SAM2) → 후처리 결과 파이프라인
- 노이즈 있는 3DGS 모델과 후처리 후 모델 비교
- SPZ 압축 및 모바일 최적화 흐름도

---

## Troubleshooting 3. SMPL 치수의 실제 단위 불일치

### 문제

SMPL 피팅 결과는 3D 좌표계 단위로 생성되어 실제 cm 단위 신체 치수와 바로 일치하지 않았습니다.

### 원인

모델의 head-to-foot 길이와 실제 사용자 키 사이에 scale 차이가 있었습니다. 예를 들어 실제 키가 **175cm**, 모델 높이가 **1.82 unit**이면 보정 없이 산출한 치수는 실제 값과 어긋납니다.

### 해결

사용자 키 기준 scale factor를 계산해 SMPL 메시 전체에 적용했습니다.

```txt
scale_factor = 실제 키(cm) / 모델 높이(unit)
scale_factor = 175 / 1.82 ≈ 96.15 cm/unit
```

보정된 메시 기준으로 어깨, 가슴, 허리, 엉덩이, 팔·다리 치수를 산출했습니다.

---

# 2. Waddoc

## Overview

**의료취약지 고령층을 위한 방문형 비대면 원격 진료 자율주행 로봇 서비스**

Waddoc은 도서·산간 의료취약지 고령층이 스마트폰 앱 없이 전화 기반으로 진료를 예약하고, 예약 시간에 맞춰 자율주행 차량이 방문해 본인확인, 활력징후 측정, WebRTC 화상진료, 진료 기록 조회까지 이어지는 E2E 의료 접근성 서비스입니다.

## Role

**Digital Twin / Vehicle Dynamics / MQTT Control**

## Period

**2026.02 ~ 2026.04**

## Tech Stack

- Unity
- C#
- ROS2
- MQTT
- Mosquitto
- MediaMTX
- Spring Robot Gateway
- WebSocket/WSS
- Vehicle Dynamics
- Digital Twin
- Serial Communication-ready Architecture

## My Work

### Unity 기반 디지털 트윈 환경 구축

- 실제 주행 환경과 유사한 Unity 시뮬레이션 공간 구성
- 관제 시스템에서 차량 위치, 방향, 이동 상태를 확인할 수 있도록 차량 상태 표현
- 차량 이동, 정지, 예외 상황을 시뮬레이션 환경에서 관측 가능하도록 구조화
- 자율주행 진료 차량의 운영 상황을 관제자가 직관적으로 확인할 수 있는 시각화 흐름 설계

### MQTT 기반 차량 관제 및 E-Stop 구조 설계

- 차량 상태 데이터를 MQTT로 송신할 수 있도록 구조화
- 관제 시스템에서 차량으로 제어 명령을 전달할 수 있는 통신 흐름 설계
- 관제 측과 차량 측 양방향에서 E-Stop이 가능하도록 비상정지 흐름 구성
- 기존 Zenoh 기반 통신 구조의 과도한 데이터 전송 문제를 분석하고 MQTT 기반 topic 구조로 전환

### Dynamic Vehicle Model 적용

- 단순 Kinematic Model이 아닌 Dynamic Model 기반 차량 움직임 구현
- damping, suspension, wheel rotation, steering이 동시에 반영되도록 구성
- 실제 모닝 차량 제원을 고려해 차체 크기, 축간거리, 바퀴 조향, 차체 반응 조정
- 관제 화면에서 차량 움직임이 실제 차량과 유사하게 보이도록 물리 기반 움직임 개선

### Serial 통신 기반 센서 확장 구조화

- 초기 Unity 시뮬레이션 단계에서는 가상 센서 데이터를 사용
- 추후 실제 차량 내부 센서 데이터를 Serial 통신으로 받을 수 있도록 데이터 구조 분리
- 센서 입력이 들어오면 차량 상태 송신, 관제 표시, 예외 상황 처리에 바로 연결될 수 있도록 확장성 확보

## Key Points

- Unity 기반 디지털 트윈 환경 구축
- MQTT 기반 차량 관제 및 E-Stop 구조 설계
- Dynamic Vehicle Model 적용
- Serial 통신 기반 센서 확장 구조 설계

## Troubleshooting 1. Zenoh 기반 통신 구조의 과도한 데이터 전송

### 문제

Unity 차량 시뮬레이터의 위치, 속도, 조향각, 센서 상태, 운행 상태가 Zenoh 기반으로 높은 주기로 계속 송신되어 관제 서버와 UI가 불필요한 상태 갱신을 반복 처리했습니다.

### 원인

telemetry와 command가 분리되지 않아 모든 차량 상태가 같은 흐름으로 전달되었습니다. 메시지 처리량은 차량 수에 따라 선형 증가했습니다.

```txt
Total Message Rate = N_vehicle × N_topic × f_publish

차량 1대, 8개 항목, 20Hz:
1 × 8 × 20Hz = 160 msg/sec

차량 5대:
5 × 8 × 20Hz = 800 msg/sec
```

### 해결

MQTT 기반 topic 구조로 전환해 상태와 명령을 분리했습니다.

```txt
Telemetry:
robot/odom
robot/state
robot/status
robot/minimap

Command:
robot/cmd/waypoint
robot/cmd/dispatch
robot/cmd/estop
```

차량 1대 기준 약 **160 msg/sec → 14 msg/sec + event-driven command** 구조로 줄였고, E-Stop은 `robot/cmd/estop`으로 분리해 일반 telemetry와 섞이지 않도록 했습니다.

### 추천 이미지

- Zenoh 단일 스트림 혼잡도 그림
- MQTT topic tree
- Before 160 msg/s vs After 14 msg/s 막대그래프

---

## Troubleshooting 2. Kinematic Model 한계를 보완한 Dynamic Vehicle Model 적용

### 문제

Kinematic 방식은 차량이 미끄러지듯 이동해 조향·제동·접지·서스펜션 반응이 부족했습니다.

### 원인

단순 위치 갱신식은 질량, 토크, 마찰, suspension을 반영하지 못했습니다.

```txt
x_dot = v cos(theta)
y_dot = v sin(theta)
theta_dot = omega
```

### 해결

ROS `cmd_vel` 입력을 Bicycle Model로 목표 조향각으로 변환하고, 실제 이동은 Unity `Rigidbody + WheelCollider` 기반 물리 모델로 처리했습니다.

```txt
δ = atan((L × ω) / max(|v|, ε))
L = 2.7m
```

차량 파라미터는 아래 기준으로 조정했습니다.

```txt
rbMass = 700kg
wheelBase = 2.7m
maxMotorTorque = 9000
brakeTorque = 6000
suspensionSpring = 38000
suspensionDamper = 7000
```

조향은 앞바퀴 `steerAngle`, 이동은 `motorTorque`, 정지는 `brakeTorque`로 처리해 차량의 조향, 바퀴 회전, 접지, 제동, 서스펜션 반응이 함께 나타나도록 구현했습니다.

### 추천 이미지

- Unity 차량 시뮬레이션 화면
- Bicycle Model 조향각 다이어그램
- Kinematic vs Dynamic trajectory 비교
- WheelCollider 구조 이미지

---

## Troubleshooting 3. 실제 센서 확장을 고려하지 않은 시뮬레이션 구조

### 문제

Unity 내부 가상 센서 데이터에만 의존하면 실제 차량 센서를 Serial 통신으로 연결할 때 관제·상태 송신·예외 처리 로직을 다시 수정해야 했습니다.

### 원인

센서 입력과 차량 상태 계산이 직접 결합되어 입력 source 교체가 어려웠습니다.

### 해결

가상 센서와 Serial 센서 입력을 공통 schema로 통합할 수 있도록 센서 입력 계층을 분리했습니다.

```txt
Unity Virtual Sensor / Serial Sensor
→ Common Sensor Data Schema
→ Vehicle State
→ MQTT Telemetry
→ E-Stop / Exception Handling
```

실제 센서가 연결되어도 관제 표시, 차량 상태 송신, 예외 처리 로직을 재사용할 수 있도록 구조화했습니다.

---

# 3. Palletizer

## Overview

**공장 물류 자동화를 위한 ROS2 기반 팔레타이징 로봇 시뮬레이션 프로젝트**

Palletizer는 공장 물류 자동화를 목표로 한 로봇 팔레타이징 프로젝트입니다. ROS2/Gazebo 기반 시뮬레이션 환경에서 로봇 이동, 팔레트 접근, 로봇팔 작업 시나리오를 검증했습니다.

## Role

**ROS2 / Navigation / Perception / Simulation**

## Period

**2026.01 ~ 2026.02**

## Tech Stack

- ROS2
- Gazebo
- Nav2
- Cartographer
- LiDAR
- Camera
- Canny Edge
- rf2o_laser_odometry
- AMCL / Particle Filter
- C++
- Vue.js

## My Work

- Cartographer + Nav2 기반 자율주행 시스템 구현
- Gazebo 기반 공장 환경 구성
- 팔레트, 로봇팔, 장애물 요소가 포함된 시뮬레이션 환경 설계
- 목표 지점 접근 시 좌표뿐 아니라 heading을 고려한 정렬 로직 설계
- LiDAR 기반 목표 지점 폭 추정 및 현재 위치 역산
- 정면 카메라 + Canny Edge 기반 외곽선 검출로 목표 지점과 수평 정렬
- IMU 인식 끊김 문제를 rf2o_laser_odometry 기반 위치 보정으로 대응
- Perception → Pose Estimation → Motion Planning → Control 통합

## Key Points

- LiDAR + Vision 기반 팔레트 정렬
- rf2o_laser_odometry 기반 localization 보정
- 상태 기반 접근-정렬-작업 전환 로직 설계
- Perception → Pose Estimation → Planning → Control End-to-End 통합

## Troubleshooting 1. 정밀 팔레트 정렬과 Localization 안정화

### 문제

목표 좌표 오차가 **10cm 이하**여도 heading 오차가 **10~15°** 남으면 팔레트 정면 정렬이 실패했습니다. 또한 MPU-9250 IMU가 로봇팔/LiDAR 전원 영향으로 간헐적으로 끊기며 odometry yaw가 흔들렸습니다.

### 원인

좌표 기반 접근만으로는 팔레트의 폭·중심·정면 방향을 반영하기 어려웠고, localization이 IMU 단일 입력에 의존해 dropout 발생 시 pose 추정이 불안정했습니다.

### 해결

LiDAR로 팔레트 폭과 중심을 역산하고, 정면 카메라의 Canny Edge로 외곽선을 검출해 heading 오차를 **10~15° → 3~5° 목표**로 보정했습니다. 동시에 `rf2o_laser_odometry`를 추가해 localization source를 **IMU 1개 → IMU + LiDAR odom 2개**로 확장하고, EKF/AMCL/Particle Filter와 결합 가능한 구조로 정리했습니다.

### 추천 이미지

- 팔레트 정면 접근 top-view
- LiDAR scan 기반 폭/중심 추정 화면
- Canny Edge 외곽선 검출 화면
- IMU only vs IMU + LiDAR odom pose trajectory 비교
- Sensor fusion pipeline

---

## Troubleshooting 2. 로봇팔 작업 전 정지 상태 판단 문제

### 문제

로봇이 목표 지점 근처에 도달해도 실제로 완전히 멈췄는지 판단하기 어려웠습니다. 선속도 **0.03m/s**, 각속도 **0.05rad/s** 정도의 미세 움직임도 팔레트 작업 위치에 영향을 줄 수 있었습니다.

### 원인

목표 좌표 도달 여부만 확인하면 미세 회전이나 잔여 속도를 구분할 수 없었습니다.

### 해결

Nav2 Behavior Tree 조건 노드에서 목표 위치와 `cmd_vel`을 함께 확인했습니다.

```txt
stop_condition =
  distance_to_goal < d_threshold
  AND linear_velocity < 0.01~0.02 m/s
  AND angular_velocity < 0.03~0.05 rad/s
```

정지 상태가 확인된 뒤 로봇팔 작업 단계로 넘어가도록 구성했습니다.

### 추천 이미지

- Nav2 Behavior Tree 일부 캡처
- 정지 조건 체크 흐름도
- 목표점 도달 후 속도 그래프

---

## Troubleshooting 3. Perception 결과와 주행 제어 간 단계 전환 불안정

### 문제

LiDAR와 카메라에서 목표 팔레트 정보가 계속 갱신되면서 Nav2 목표 pose가 흔들렸고, 접근 단계와 정렬 단계가 섞여 로봇이 목표 지점 근처에서 불필요하게 waypoint를 반복 수정하는 현상이 발생했습니다.

### 원인

Perception 결과를 바로 제어 입력으로 연결하면 센서 노이즈와 순간 인식 오차가 그대로 주행 목표를 흔듭니다. 특히 장거리 접근과 근거리 정렬은 요구 정밀도와 제어 방식이 다른데도 같은 루프에서 처리하고 있었습니다.

### 해결

주행을 `Approach → Align → Stop Confirm → Arm Ready`의 상태 기반 단계로 분리하고, 목표 pose는 연속된 안정 프레임에서만 갱신되도록 했습니다.

```txt
if stable_frames >= 3 and heading_error < threshold:
  lock_target_pose = true
  transition_to_align()
```

접근 단계에서는 좌표 중심 이동만 수행하고, 정렬 단계에 들어간 뒤에만 heading 보정을 활성화해 목표 흔들림을 줄였습니다. 이 구조 덕분에 perception 오차가 있어도 작업 직전 제어 루프가 더 안정적으로 유지되도록 정리했습니다.

### 추천 이미지

- Approach / Align / Stop Confirm 상태 전이 다이어그램
- 목표 pose 갱신 전/후 trajectory 비교
- Perception 입력과 Nav2 goal 갱신 주기 비교 그래프

---

# 4. MyLitUniverse

## Overview

**책의 의미와 맥락을 3D 우주 공간에 시각화하는 AI 기반 도서 탐색 플랫폼**

MyLitUniverse는 기존 온라인 서점의 2D 리스트 방식에서 벗어나, 책과 책 사이의 보이지 않는 맥락을 3D 공간에 시각화하여 사용자가 우주를 유영하듯 책을 발견할 수 있도록 만든 독서 경험 플랫폼입니다.

## Role

**AI / Frontend / 3D Visualization**

## Period

**2025.11 ~ 2025.12**

## Tech Stack

- Vue.js 3
- Three.js
- Django
- Doc2Vec
- KoNLPy
- RAG
- OpenAI GPT-4o
- Gemini 2.0 Flash
- MySQL
- Kakao Map API
- Toss Payments API

## My Work

- Doc2Vec 기반 도서 추천 모델링
- 지속 학습 가능한 도서 임베딩 파이프라인 구성
- Three.js 기반 3D 도서 우주 시각화
- WebGL 렌더링 성능 문제 개선
- RAG + GPT 기반 도서 분석 파이프라인 구성
- 응답 토큰 절감을 위한 도서 데이터 전처리 및 JSON 응답 구조화
- Vue.js 컴포넌트 설계 및 상태 관리
- 카카오맵 API 기반 오프라인 서점 찾기 구현

## Key Points

- 1,000권+ 도서 3D 공간 시각화
- Doc2Vec + T-SNE 기반 의미 좌표화
- 3D 시각화 기반 탐색 UX 구현
- RAG 토큰 70% 경량화
- 구조화된 LLM 응답 기반 UI 안정성 확보
- SSAFY 프로젝트 우수상

## Troubleshooting 1. 3D 도서 탐색 성능 최적화와 RAG 경량화

### 문제

1,000권 이상의 도서를 3D 공간에 배치하면서 초기 로딩과 카메라 조작이 무거워졌고, RAG 기반 도서 분석은 요청당 토큰 수가 약 **5,000 tokens**까지 증가해 응답 속도와 UI 안정성에 부담이 생겼습니다.

### 원인

초기에는 도서 상세 정보, 임베딩, 좌표, 렌더링 객체를 한 번에 불러와 WebGL 초기 부담이 컸고, RAG도 유사 도서 5권의 원문 설명을 그대로 넣어 불필요한 토큰이 과도하게 증가했습니다.

### 해결

3D 렌더링은 초기 데이터를 `id`, `x`, `y`, `z`, `category` 중심으로 축소하고, 상세 정보는 lazy loading으로 분리해 초기 payload를 약 **70~80% 축소**했습니다. 동시에 RAG는 `title / category / keywords / summary` 기반 compact schema와 Top-3 제한을 적용해 요청당 토큰을 약 **5,000 → 1,500 tokens**, 약 **70% 절감**했습니다.

### 추천 이미지

- 3D 도서 우주 메인 화면
- Full metadata vs lightweight payload 비교
- RAG 토큰 before/after 막대그래프
- Compact schema → JSON UI 카드 매핑 구조도

---

## Troubleshooting 2. 의미 기반 추천이 카테고리 편향으로 쏠리는 문제

### 문제

초기 추천 결과는 같은 카테고리 책끼리만 과도하게 묶이거나, 제목은 비슷하지만 실제 맥락이 다른 책이 가깝게 배치되는 문제가 있었습니다. 사용자가 기대하는 "의미상 유사한 책 탐색" 경험과 차이가 있었습니다.

### 원인

짧은 제목과 요약만으로 임베딩을 구성하면 문맥 정보가 부족해집니다. 또한 단순 유사도 점수만 사용하면 장르, 키워드, 핵심 주제 간 균형이 맞지 않아 추천이 한쪽으로 쏠릴 수 있습니다.

### 해결

KoNLPy 기반 형태소 전처리로 핵심 명사와 키워드를 정리하고, `title + summary + category + keywords` 조합으로 Doc2Vec 입력을 재구성했습니다. 추천 점수도 임베딩 유사도 하나로 결정하지 않고 카테고리·키워드 일치도를 함께 반영하도록 보완했습니다.

```txt
recommendation_score =
  0.6 * embedding_similarity
  + 0.25 * category_overlap
  + 0.15 * keyword_match
```

이후 T-SNE 시각화로 군집이 지나치게 뭉치거나 퍼지는 구간을 확인하면서 추천 결과를 반복 보정했습니다.

### 추천 이미지

- 도서 임베딩 2D/3D 군집 시각화
- 추천 전/후 유사 도서 카드 비교
- recommendation score 구성 다이어그램

---

## Troubleshooting 3. 자유 형식 LLM 응답으로 UI 렌더링이 깨지는 문제

### 문제

GPT와 Gemini가 책 설명, 추천 이유, 요약 포맷을 매번 다르게 반환하면서 프론트엔드 카드 UI가 줄바꿈·필드 누락·예상치 못한 문장 구조 때문에 불안정하게 렌더링되었습니다.

### 원인

자유 형식 텍스트 응답은 사람이 읽기에는 자연스럽지만, 컴포넌트가 기대하는 필드 구조를 항상 보장하지 않습니다. 특히 여러 모델을 함께 쓰면 응답 스타일 차이가 더 크게 드러납니다.

### 해결

응답 형식을 고정된 JSON schema로 제한하고, 필수 필드 검증 후에만 UI로 전달했습니다.

```json
{
  "title": "string",
  "summary": "string",
  "keywords": ["string"],
  "recommended_reason": "string"
}
```

필드가 누락되면 기본값을 넣거나 재요청하도록 처리해 프론트엔드 컴포넌트가 항상 동일한 구조를 받도록 만들었습니다. 그 결과 LLM 기반 분석 결과를 카드, 모달, 상세 패널에 안정적으로 재사용할 수 있었습니다.

### 추천 이미지

- LLM raw text vs structured JSON 비교
- JSON schema 검증 흐름도
- 응답 데이터가 UI 카드로 매핑되는 컴포넌트 구조

---

# 5. AI_Refrigerator / IOMEAL

## Overview

**라즈베리파이와 터치스크린을 활용한 저비용 모듈형 AI 스마트 냉장고 시스템**

IOMEAL은 Raspberry Pi 5와 터치스크린을 활용해 기존 냉장고나 팬트리에 부착할 수 있는 스마트 냉장고 시스템입니다. 식재료 관리, 유통기한 추적, 레시피 추천, 가족 간 메모 공유 기능을 제공합니다.

## Role

**On-device AI / Backend / Vision / IoT**

## Period

**2024.06 ~ 2024.10**

## Tech Stack

- Raspberry Pi 5
- Touchscreen
- Python
- Django
- OpenCV
- Ultralytics YOLO
- Ollama
- OpenAI API
- OCR
- MariaDB / MySQL

## My Work

- Raspberry Pi 5 기반 온디바이스 AI 구조 검토
- Ollama 기반 로컬 LLM 구동 및 경량화 시도
- 발열과 CPU 부하로 인한 추론 지연 문제 분석
- YOLO 기반 식재료 자동 인식
- OCR/바코드 기반 식재료 등록 흐름 구현
- Django 기반 FoodItem 저장 및 유통기한 계산 로직 구현
- 사용자 입력을 보완하기 위한 UX 설계
- 알레르기, 선호도, 유통기한을 고려한 재료 소진 우선순위 로직 설계
- 라즈베리파이 터치스크린 환경을 고려한 기능 흐름 설계

## Key Points

- Edge Device 기반 실시간 인식 시스템
- 식품 인식 → DB → 알림 → 추천 End-to-End 통합
- Raspberry Pi 5 환경에서 On-device LLM 최적화 시도
- 특허 출원 진행 중

## Troubleshooting 1. Raspberry Pi 5 온디바이스 LLM 추론 지연 및 발열

### 문제

Ollama 기반 로컬 LLM 추론 시 레시피 추천이 **25~40초** 걸리고, CPU **85~95%**, SoC 온도 **78~82°C**까지 상승했습니다.

### 원인

저전력 엣지 디바이스에서 LLM을 지속 실행해 thermal throttling과 응답 지연이 발생했습니다.

### 해결

rule/cache와 LLM 작업을 분리했습니다. 유통기한·알레르기·보관 판단은 **0.3~1초** rule 기반으로 처리하고, 레시피 생성만 조건부 LLM으로 전달했습니다. 반복 요청 캐싱으로 LLM 호출을 약 **60~70% 감소**시켰습니다.

### 추천 이미지

- Raspberry Pi CPU/온도 그래프
- Rule Engine vs LLM 분기 구조
- 캐시 hit 흐름도
- Raspberry Pi 시스템 모니터 캡처

---

## Troubleshooting 2. 가려진 식재료와 포장 상태로 인한 인식 정확도 저하

### 문제

비닐·용기·겹침 때문에 YOLO confidence가 **0.6 미만**으로 떨어지는 객체는 자동 등록 신뢰도가 낮았습니다.

### 원인

카메라 인식만으로는 포장 상태, 수량, 보관 방식까지 안정적으로 판단하기 어려웠습니다.

### 해결

YOLO + OCR + 바코드 + 사용자 수정 UX로 입력 경로를 분리했습니다. confidence **0.6 이상**은 자동 후보, **0.4~0.6**은 사용자 확인으로 넘겼습니다. 유통기한·선호도·알레르기·보관 방식을 점수화해 재료 소진 우선순위를 계산했습니다.

```txt
Priority =
0.45 × 유통기한 임박도
+ 0.25 × 사용자 선호도
+ 0.20 × 재료 인식 신뢰도
+ 0.10 × 보관 방식 위험도
- 알레르기 패널티
```

### 추천 이미지

- 냉장고 내부 YOLO bbox 화면
- OCR/바코드/수동입력 3-way UX
- 재료 우선순위 카드

---

## Troubleshooting 3. 영수증 OCR 결과의 비정형 텍스트 처리

### 문제

OCR 결과는 상품명·가격·수량·구매일이 비정형 텍스트로 추출되어 DB 저장이 어려웠습니다.

### 원인

OCR은 텍스트만 추출하고 식품 여부, 상품별 가격·수량 매핑, 구매일 구조화를 보장하지 않습니다.

### 해결

OCR 결과를 OpenAI API로 `purchase_date`, `items`, `item_name`, `unit_price`, `quantity`, `total_price` JSON으로 변환했습니다. 식품 항목만 포함하도록 제한해 DB 저장 가능한 구조로 정제했습니다.

### 추천 이미지

- 영수증 원본 → OCR text → JSON 변환 파이프라인
- DB 저장 결과 테이블

---

# Portfolio Card Summary

| Project | Role | Summary |
|---|---|---|
| **MoM / Model of Me** | AI / Hardware | 스마트폰 360도 영상 기반 3D 아바타 생성, SMPL 신체 치수 측정, 운동 자세 피드백 서비스 |
| **Waddoc** | Digital Twin / Vehicle Dynamics / MQTT Control | Unity 디지털 트윈과 Dynamic Vehicle Model을 적용하고, MQTT 기반 차량 관제 및 E-Stop 구조를 설계한 방문형 비대면 진료 자율주행 로봇 서비스 |
| **Palletizer** | ROS2 / Navigation / Perception / Simulation | LiDAR, Camera, rf2o_laser_odometry를 활용해 팔레트 접근, 정렬, 정지 판단까지 연결한 물류 자동화 로봇 프로젝트 |
| **MyLitUniverse** | AI / Frontend / 3D Visualization | Doc2Vec과 Three.js로 책의 맥락을 3D 우주 공간에 시각화하고, 경량화된 RAG와 구조화된 LLM 응답을 설계한 AI 도서 플랫폼 |
| **AI_Refrigerator / IOMEAL** | On-device AI / Backend / Vision / IoT | Raspberry Pi 기반 스마트 냉장고에서 온디바이스 추론 최적화, 식재료 인식, OCR·바코드 등록, 알레르기 기반 추천을 구현한 프로젝트 |

---

# Visual Asset Checklist

## MoM

- 3DGS before/after artifact 이미지
- 3D trajectory comparison 이미지
- SMPL 치수 측정 이미지
- 회전 촬영 하드웨어 이미지

## Waddoc

- Unity 차량 디지털 트윈 화면
- MQTT topic tree
- Dynamic Vehicle Model 수식/구조도
- 관제 시스템 화면

## Palletizer

- Gazebo/RViz 화면
- LiDAR scan 기반 팔레트 정렬 이미지
- 접근-정렬-작업 상태 전이 다이어그램
- Sensor fusion pipeline

## MyLitUniverse

- 3D 도서 우주 화면
- 도서 임베딩 군집 시각화
- RAG token before/after 그래프
- Compact schema 카드
- JSON → UI 매핑 이미지

## AI_Refrigerator / IOMEAL

- Raspberry Pi 시스템 모니터 캡처
- 스마트 냉장고 하드웨어 목업
- YOLO bbox 식재료 인식 화면
- OCR → JSON 파이프라인

---

# Site Section Suggestion

## Hero

```txt
로봇과 AI가 현실에서 움직이게 만드는 개발자 김주호입니다.
```

또는

```txt
코드가 현실에서 움직이는 순간을 만드는 개발자 김주호입니다.
```

## Project Detail Page Structure

```txt
Project Title
One-line Summary
Role / Period / Tech Stack
Overview
My Work
Key Points
Troubleshooting
Images / Demo / GitHub Link
```

## Troubleshooting Card Format

```txt
Title
Problem
Cause
Solution
Key Metrics
Related Image
```
