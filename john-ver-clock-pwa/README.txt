John ver clock (PWA)

[구성]
index.html            앱 본체 (오늘, 달력, 설정 화면, 응원 문구, 설치 안내)
manifest.webmanifest  앱 이름, 아이콘, 색상, 실행 방식
sw.js                 오프라인 동작을 위한 서비스 워커
icons/                앱 아이콘 (192, 512, maskable 512, iOS 180)

[배포]
1. 폴더 전체를 HTTPS 정적 호스팅에 업로드 (Netlify, Vercel, Cloudflare Pages, GitHub Pages 등)
   - 서비스 워커는 HTTPS 또는 localhost에서만 동작합니다. 파일을 더블클릭해서 여는 방식으로는 설치되지 않습니다.
   - 하위 경로(예: user.github.io/john-ver-clock/)에 올려도 동작하도록 모든 경로를 상대 경로로 작성했습니다.
2. 접속 후 설치
   - 안드로이드 Chrome, 데스크톱 Chrome/Edge: 화면 상단의 "앱으로 설치" 버튼
   - 아이폰 Safari: 공유 버튼, "홈 화면에 추가"

[수정 후 재배포]
- index.html 등을 고쳤다면 sw.js 맨 위의 VERSION 값을 올려 주세요. (현재 v2, 다음 배포는 v3)
  올리지 않으면 이미 설치한 사용자에게 이전 캐시가 남을 수 있습니다.

[공휴일 갱신]
- index.html 안의 "공휴일" 블록(H('YYYY-MM-DD', ...) 목록)에 해당 연도를 추가합니다. 현재 2025~2027년 반영.

[기본값]
- 세후 월급 500만원, 09:00 출근, 18:00 퇴근, 점심 12:00~13:00. 모두 앱의 설정 탭에서 바꿀 수 있습니다.

[저장 방식]
- 급여, 입사일, 휴가 표시는 사용자 브라우저(localStorage)에만 저장되며 서버로 전송되지 않습니다.
- 브라우저 데이터를 지우면 입력값도 함께 지워집니다.
