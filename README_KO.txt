STEAL THE RAINBOW — 사운드 개선판 v1.1.0

실행/빌드
python -m pip install -r requirements.txt
python build_exact.py
그 뒤 dist/index.html을 데스크톱 브라우저에서 여세요.
파일 하나로 실행되며 게임 플레이에는 서버나 인터넷 연결이 필요하지 않습니다.

가독성 소스
GitHub 전송 안정성을 위해 원본 JS는 src/readable_parts/00.js ~ 08.js로 순서대로 나누어 두었습니다.
python assemble_source.py 를 실행하면 동일한 src/game.js가 복원됩니다.

조작
A/D 또는 좌우 방향키: 이동 / W, Space, 위 방향키: 점프
S/아래 방향키: 잎 발판 아래로 / 클릭: 색 흡수 또는 전달
Z: 색 이동 되돌리기 / R: 스테이지 재시작 / H: 힌트
Esc: 일시정지 / M: 소리 켜기·끄기

제출
제출 파일: dist/STEAL_THE_RAINBOW_js13k_SUBMIT.zip
실제 크기: 12,737바이트 / 제한 13,312바이트 / 여유 575바이트
SHA-256: 322bb3e242df345898b89d5994beed3c3f3d896d00ea60e8b37eb64efe6c0b82
ZIP 최상위에는 index.html 하나만 있습니다.
이 GitHub 저장소 전체를 대회 게임 ZIP으로 제출하지 마세요.

이 저장소의 공개 소스 게시까지 완료되었습니다. js13kGames 사이트의 최종 게임 업로드/Submit은 별도 단계입니다.
