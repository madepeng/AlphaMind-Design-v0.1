from PyInstaller.utils.hooks import collect_submodules

hidden_imports = (
    collect_submodules("aiosqlite")
    + collect_submodules("sqlalchemy.dialects.sqlite")
    + collect_submodules("uvicorn")
)

analysis = Analysis(
    ["app/packaged.py"],
    pathex=["."],
    binaries=[],
    datas=[],
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=["pytest", "mypy", "ruff"],
    noarchive=False,
    optimize=1,
)
python_archive = PYZ(analysis.pure)

executable = EXE(
    python_archive,
    analysis.scripts,
    [],
    exclude_binaries=True,
    name="alphamind-backend",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=True,
    target_arch="x86_64",
)

distribution = COLLECT(
    executable,
    analysis.binaries,
    analysis.datas,
    strip=False,
    upx=False,
    name="alphamind-backend",
)
