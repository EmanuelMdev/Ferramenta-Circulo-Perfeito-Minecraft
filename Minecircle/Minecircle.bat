@echo off
setlocal

rem Abre o Minecircle numa janela propria (Edge ou Chrome), sem barra de enderecos.
rem Uso opcional: Minecircle.bat "https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/"

set "PAGINA=%~dp0index.html"
set "URL=file:///%PAGINA:\=/%"
if not "%~1"=="" set "URL=%~1"

if "%~1"=="" if not exist "%PAGINA%" (
    echo Nao encontrei o index.html em "%~dp0"
    pause
    exit /b 1
)

set "NAV="
if not defined NAV if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "NAV=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined NAV if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "NAV=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined NAV if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "NAV=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined NAV if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "NAV=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined NAV if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "NAV=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if not defined NAV (
    echo Nao achei o Edge nem o Chrome. Abra o index.html manualmente.
    pause
    exit /b 1
)

start "" "%NAV%" --app="%URL%" --window-size=1100,820 --user-data-dir="%LOCALAPPDATA%\Minecircle" --no-first-run --no-default-browser-check
