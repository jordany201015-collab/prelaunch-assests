use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf, thread, time::Duration};
use tauri::{AppHandle, Emitter, Manager};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Session {
    username: String,
    uuid: String,
    access_token: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct DeviceCodeInfo {
    user_code: String,
    verification_uri: String,
    verification_uri_complete: String,
    expires_in: u64,
    interval: u64,
    message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Resolution {
    width: u32,
    height: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct InstanceSettings {
    ram_min_mb: u32,
    ram_max_mb: u32,
    java_path: String,
    jvm_args: String,
    resolution: Resolution,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct Instance {
    id: String,
    name: String,
    settings: InstanceSettings,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct ProgressPayload {
    stage: String,
    downloaded: u32,
    total: u32,
    current_file: String,
}

fn app_data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    app.path()
        .resolve("", tauri::path::BaseDirectory::AppData)
        .map_err(|e| format!("path resolve error: {e}"))
}

fn session_path(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(app_data_dir(app)?.join("session.json"))
}

fn instances_dir(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(app_data_dir(app)?.join("instances"))
}

fn ensure_dir(path: &PathBuf) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|e| format!("create dir error: {e}"))
}

fn default_settings() -> InstanceSettings {
    InstanceSettings {
        ram_min_mb: 2048,
        ram_max_mb: 4096,
        java_path: "java".into(),
        jvm_args: "-XX:+UseG1GC".into(),
        resolution: Resolution {
            width: 1280,
            height: 720,
        },
    }
}

fn mock_instances() -> Vec<Instance> {
    vec![
        Instance {
            id: "alpha".into(),
            name: "Alpha Survival".into(),
            settings: default_settings(),
        },
        Instance {
            id: "beta".into(),
            name: "Beta Modpack".into(),
            settings: default_settings(),
        },
        Instance {
            id: "gamma".into(),
            name: "Gamma Vanilla".into(),
            settings: default_settings(),
        },
    ]
}

#[tauri::command]
fn get_session(app: AppHandle) -> Result<Option<Session>, String> {
    let path = session_path(&app)?;
    if !path.exists() {
        return Ok(None);
    }

    let content = fs::read_to_string(path).map_err(|e| format!("read session error: {e}"))?;
    let session = serde_json::from_str::<Session>(&content)
        .map_err(|e| format!("parse session error: {e}"))?;
    Ok(Some(session))
}

#[tauri::command]
fn auth_start_device_code() -> DeviceCodeInfo {
    DeviceCodeInfo {
        user_code: "ABCD-EFGH".into(),
        verification_uri: "https://www.microsoft.com/link".into(),
        verification_uri_complete: "https://www.microsoft.com/link?otc=ABCD-EFGH".into(),
        expires_in: 900,
        interval: 5,
        message: "Ingresa el código ABCD-EFGH para iniciar sesión.".into(),
    }
}

#[tauri::command]
fn auth_poll(app: AppHandle) -> Result<Session, String> {
    let session = Session {
        username: "Steve".into(),
        uuid: "123e4567-e89b-12d3-a456-426614174000".into(),
        access_token: "fake_access_token".into(),
    };

    let app_data = app_data_dir(&app)?;
    ensure_dir(&app_data)?;
    let path = session_path(&app)?;
    let content = serde_json::to_string_pretty(&session).map_err(|e| format!("json error: {e}"))?;
    fs::write(path, content).map_err(|e| format!("write session error: {e}"))?;

    Ok(session)
}

#[tauri::command]
fn logout(app: AppHandle) -> Result<(), String> {
    let path = session_path(&app)?;
    if path.exists() {
        fs::remove_file(path).map_err(|e| format!("remove session error: {e}"))?;
    }
    Ok(())
}

#[tauri::command]
fn instances_list() -> Vec<Instance> {
    mock_instances()
}

#[tauri::command]
fn instance_get(id: String, app: AppHandle) -> Result<Instance, String> {
    if let Some(found) = mock_instances().into_iter().find(|x| x.id == id) {
        let stored_path = instances_dir(&app)?.join(&found.id).join("instance.json");
        if stored_path.exists() {
            let content = fs::read_to_string(stored_path).map_err(|e| format!("read instance error: {e}"))?;
            let stored = serde_json::from_str::<Instance>(&content)
                .map_err(|e| format!("parse instance error: {e}"))?;
            return Ok(stored);
        }
        return Ok(found);
    }
    Err("instance not found".into())
}

#[tauri::command]
fn instance_save_settings(id: String, settings: InstanceSettings, app: AppHandle) -> Result<(), String> {
    let mut instance = mock_instances()
        .into_iter()
        .find(|x| x.id == id)
        .ok_or_else(|| "instance not found".to_string())?;
    instance.settings = settings;

    let root = instances_dir(&app)?;
    let dir = root.join(&instance.id);
    ensure_dir(&dir)?;
    let path = dir.join("instance.json");

    let content = serde_json::to_string_pretty(&instance).map_err(|e| format!("json error: {e}"))?;
    fs::write(path, content).map_err(|e| format!("write instance error: {e}"))?;
    Ok(())
}

#[tauri::command]
fn launch_prepare(instance_id: String, app: AppHandle) -> Result<(), String> {
    let stages = ["libraries", "assets", "mods", "extract", "launch"];

    for stage in stages {
        for i in 1..=5 {
            let payload = ProgressPayload {
                stage: stage.into(),
                downloaded: i,
                total: 5,
                current_file: format!("{instance_id}-{stage}-{i}.bin"),
            };

            app.emit("mc:progress", payload)
                .map_err(|e| format!("emit error: {e}"))?;
            thread::sleep(Duration::from_millis(200));
        }
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_session,
            auth_start_device_code,
            auth_poll,
            logout,
            instances_list,
            instance_get,
            instance_save_settings,
            launch_prepare
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
