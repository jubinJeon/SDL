1. nodejs 설치

	a. node.js 다운로드 페이지 : http://www.nodejs.org<br />
	b. LTS버전 클릭 후 다운<br />
	c. 설치<br />
	d. cmd에서 node -v입력<br />
	e. 버전정보가 출력되면 정상설치.<br />

2. visual studio code 설치

	a. visual studio code 다운로드 페이지 : https://code.visualstudio.com/download<br />
	b. os 맞는 버전 클릭<br />
	c. 설치<br />

3. 프로젝트 clone

	a. visual studio code 좌측 네비게이션 source control 탭 클릭<br />
	b. Clone Repository 클릭<br />
	c. Repository Location 선택<br />
	d. clone 된 repository visual studio code 로 열기<br />
	
5. 패키지 설치

	a. visual studio code 상단  Termial 클릭 후 새터미널 선택<br />
	b. 터미널 창에서 "npm install" 입력 후 엔터<br />
	c. 패키지 설치<br />
	
6. 개발 서버 시작

	a. 터미널 창에 "npm start" 입력 후 엔터<br />
	b. 개발 서버 시작<br />

    => 변경(개발) : npm run debug.dev
	=> 변경(운영) : npm run debug.prd

7. 빌드 및 개발 서버 배포

	a. 터미널 창에 "npm run build" 입력 후 엔터<br />

	=> 변경(개발) : npm run build.dev
	=> 변경(운영) : npm run build.prd

	b. 빌드<br />
     (단 전송전 원격지의 precached-manifest 파일과 static 폴더를 삭제후 전송)<br />
	d. 배포 완료<br />
	
	=> 변경 deploy스크립트 추가
	   방법 : 
	   
	   
	   ```
	   (개발) npm run deploy.dev
	   (운영1) npm run deploy.prd1
	   (운영2) npm run deploy.prd2
	   
	   ```




