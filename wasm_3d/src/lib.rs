use bevy::log;
use log::Level;
use log::info;
use bevy::prelude::*;
use wasm_bindgen::prelude::wasm_bindgen;
//add monitoring libs
use bevy::diagnostic::{FrameTimeDiagnosticsPlugin, Diagnostics};


fn fps_text_update_system(diagnostics: Res<Diagnostics>) {
    if let Some(value) = diagnostics
    .get(FrameTimeDiagnosticsPlugin::FPS)
    .and_then(|fps| fps.smoothed()) {
        // Log the FPS value 
        info!("FPS: {}", value);
    } else {
        // Log that the FPS value is not available
        info!("FPS: N/A");
    }
}

#[wasm_bindgen]
pub fn run_bevy_app() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_startup_system(setup_3d)
        .add_system(keyboard_input_system)
        //add the monitoring calls
        .add_plugin(FrameTimeDiagnosticsPlugin)
        //.add_system(setup_fps_counter)
        .add_system(fps_text_update_system)
        .run();
}

fn setup_3d(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    asset_server: Res<AssetServer>
) {
    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(0.0, 0.0, 48.0) // Position to match Three.js
            .looking_at(Vec3::ZERO, Vec3::Y), // Look at the origin
        projection: Projection::Perspective(PerspectiveProjection {
            fov: 45.0f32.to_radians(), // FOV in radians
            near: 1.0, // Near plane
            far: 1000.0, // Far plane
            ..default()
        }),
        ..default()
    });
    commands.spawn(SceneBundle {
        scene: asset_server.load("../../src/assets/truck.glb#Scene0"),
        ..default()
    }); 

    commands.spawn(DirectionalLightBundle {
        directional_light: DirectionalLight {
            illuminance: 10000.0, // Brightness of the light
            ..Default::default()
        },
        transform: Transform::from_rotation(Quat::from_rotation_x(-std::f32::consts::FRAC_PI_4)),
        ..Default::default()
    });
}


fn keyboard_input_system(
    keyboard_input: Res<Input<KeyCode>>,
    mut query: Query<(&mut Transform, &Camera)>, // Query both Transform and Camera components
) {
    for (mut transform, _) in query.iter_mut() {
        // Rotate left with left arrow
        if keyboard_input.pressed(KeyCode::Left) {
            transform.rotate(Quat::from_rotation_y(0.05));
        }
        // Rotate right with right arrow
        if keyboard_input.pressed(KeyCode::Right) {
            transform.rotate(Quat::from_rotation_y(-0.05));
        }
        let forward = transform.forward();
        if keyboard_input.pressed(KeyCode::Up) {
            transform.translation += forward * 0.5; // Zoom in
        }
        if keyboard_input.pressed(KeyCode::Down) {
            transform.translation -= forward * 0.5; // Zoom out
        }
    }
}