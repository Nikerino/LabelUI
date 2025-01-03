set APP_DIR=%~dp0..
set WEB_DIR=%~dp0..\web

setlocal

set HOST=127.0.0.1
set PORT=8001

pushd %APP_DIR%
start venv\python.exe -m labelui --host %HOST% --port %PORT%
popd

endlocal

pushd %WEB_DIR%
start npm run dev
popd
