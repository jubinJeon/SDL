1. nodejs 설치
	a. node.js 다운로드 페이지 : http://www.nodejs.org
	b. LTS버전 클릭 후 다운
	c. 설치
	d. cmd에서 node -v입력
	
	버전정보가 출력되면 정상설치.

2. visual studio code 설치
	a. visual studio code 다운로드 페이지 : https://code.visualstudio.com/download
	b. os 맞는 버전 클릭
	c. 설치

3. 프로젝트 clone
	a. visual studio code 좌측 네비게이션 source control 탭 클릭
	b. Clone Repository 클릭
	c. 입력창에 "http://10.98.86.17/kisvanDeliveryOrder/orderApp.git" 후 엔터
	d. Repository Location 선택
	e. clone 된 repository visual studio code 로 열기
	
4. 패키지 설치
	a. visual studio code 상단  Termial 클릭 후 새터미널 선택
	b. 터미널 창에서 "npm install" 입력 후 엔터
	c. 패키지 설치
	
5. 개발 서버 시작
	a. 터미널 창에 "npm start" 입력 후 엔터
	b. 개발 서버 시작
	
6. 빌드 및 개발 서버 배포
	a. 터미널 창에 "npm run build" 입력 후 엔터
	b. 빌드
	c. FTP 통해 /kis/kisweb/smartorder/nweb/www 폴더 빌드 된 파일 전송 (단 전송전 원격지의 precached-manifest 파일과 static 폴더를 삭제후 전송)
	d. 배포 완료




