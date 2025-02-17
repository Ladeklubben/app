use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri::Wry;
use tauri_plugin_store::StoreExt;

#[derive(Serialize, Deserialize, Clone)]
pub struct AuthData {
    email: String,
    hashed_password: String,
    token: String,
}

#[tauri::command]
async fn save_auth(app: tauri::AppHandle<Wry>, auth: AuthData) -> Result<(), String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;
    store.set("auth", json!(auth));
    store.save().map_err(|e| e.to_string())?;
    store.close_resource();
    Ok(())
}

#[tauri::command]
async fn get_auth(app: tauri::AppHandle<Wry>) -> Result<AuthData, String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;
    let auth_value = store
        .get("auth")
        .ok_or("Auth data not found".to_string())?;
    let auth = auth_value
        .as_object()
        .ok_or("Invalid auth data format".to_string())?;

    let auth_data = AuthData {
        email: auth
            .get("email")
            .ok_or("Email not found")?
            .as_str()
            .ok_or("Invalid email format")?
            .to_string(),
        hashed_password: auth
            .get("hashed_password")
            .ok_or("Hashed password not found")?
            .as_str()
            .ok_or("Invalid hashed password format")?
            .to_string(),
        token: auth
            .get("token")
            .ok_or("Token not found")?
            .as_str()
            .ok_or("Invalid token format")?
            .to_string(),
    };

    store.close_resource();
    Ok(auth_data)
}

#[tauri::command]
async fn log_out(app: tauri::AppHandle<Wry>) -> Result<(), String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;
    store.delete("auth");
    store.save().map_err(|e| e.to_string())?;
    store.close_resource();
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![save_auth, get_auth, log_out])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}