use tauri::Wry;
use tauri_plugin_store::StoreExt;
use serde_json::json;

#[tauri::command]
async fn save_auth_token(app: tauri::AppHandle<Wry>, token: String) -> Result<(), String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;
    store.set("auth_token", json!(token));
    store.save().map_err(|e| e.to_string())?;
    store.close_resource();
    Ok(())
}

#[tauri::command]
async fn get_auth_token(app: tauri::AppHandle<Wry>) -> Result<String, String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;
    let token = store.get("auth_token").ok_or("Token not found".to_string())?;
    store.close_resource();
    Ok(token.to_string())
}

#[tauri::command]
async fn log_out(app: tauri::AppHandle<Wry>) -> Result<(), String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;
    store.delete("auth_token");
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
        .invoke_handler(tauri::generate_handler![save_auth_token, get_auth_token, log_out])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}