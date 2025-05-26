use std::io::Write;
use std::process::Command;
use tempfile::NamedTempFile;

#[tauri::command]
fn get_env_var(key: String) -> Option<String> {
    std::env::var(key).ok()
}

#[tauri::command]
async fn kill_process(pid: u32) -> Result<(), String> {
    // Kill the process with the given PID and its sub-process
    #[cfg(target_os = "windows")]
    let output = Command::new("taskkill")
        .args(&["/PID", &pid.to_string(), "/F", "/T"])
        .output()
        .map_err(|e| e.to_string())?;

    #[cfg(any(target_os = "linux", target_os = "macos"))]
    let output = Command::new("kill")
        .args(&["-9", &pid.to_string()])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to kill process: {}", stderr))
    }
}

#[tauri::command]
async fn run_cmd_script(script: String) -> Result<String, String> {
    let mut temp = NamedTempFile::new().map_err(|e| e.to_string())?;
    write!(temp, "{}", script).map_err(|e| e.to_string())?;

    let path = temp.path().to_str().ok_or("Invalid path")?;

    let output = Command::new("cmd")
        .args(["/C", path])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .max_file_size(100_000_000 /* bytes */)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            kill_process,
            run_cmd_script,
            get_env_var
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
