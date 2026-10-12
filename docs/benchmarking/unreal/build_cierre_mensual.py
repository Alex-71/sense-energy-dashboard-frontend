# -*- coding: utf-8 -*-
"""
Blockout de "Cierre Mensual" para Unreal Engine 5.8 (Python de editor).
Crea: nivel con piso, pasillo, portal con puertas, estanteria con 18 cajas (codigos anonimizados),
carro de archivo, escaner, pedestal; luces; CineCameraActor; LevelSequence con las posiciones de camara
del guion (90 s a 24 fps) y un trabajo de Movie Render Queue a 4K.

NO PROBADO en un editor real: escrito desde la documentacion publica de la API de Python de Unreal.
Ejecutar desde Editor > Tools > Execute Python Script (o via el plugin de Claude Code para Unreal) con un mapa guardado.
Convencion de ejes: la escena web usa metros con -Z hacia adelante; Unreal usa cm con +X adelante, +Y derecha, +Z arriba.
    UE.X = -z_web * 100 ; UE.Y = x_web * 100 ; UE.Z = y_web * 100
"""
import unreal

FPS = 24
DUR_S = 90
CM = 100.0
CONTENT_DIR = "/Game/CierreMensual"

actor_sub = unreal.get_editor_subsystem(unreal.EditorActorSubsystem)
asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
cube = unreal.EditorAssetLibrary.load_asset("/Engine/BasicShapes/Cube")
cylinder = unreal.EditorAssetLibrary.load_asset("/Engine/BasicShapes/Cylinder")
sphere = unreal.EditorAssetLibrary.load_asset("/Engine/BasicShapes/Sphere")

def web_to_ue(x, y, z):
    return unreal.Vector(-z * CM, x * CM, y * CM)

def box(name, center_web, size_m, mesh=None, folder="Blockout"):
    """Caja de 1 m base escalada. center_web = (x,y,z) en metros (ejes web). size_m = (ancho x, alto y, profundidad z)."""
    a = actor_sub.spawn_actor_from_class(unreal.StaticMeshActor, web_to_ue(*center_web))
    a.set_actor_label(name)
    a.set_folder_path(folder)
    a.static_mesh_component.set_static_mesh(mesh or cube)
    sx, sy, sz = size_m
    a.set_actor_scale3d(unreal.Vector(sz, sx, sy))   # X=profundidad, Y=ancho, Z=alto
    a.set_mobility(unreal.ComponentMobility.STATIC)
    return a

def light(name, center_web, intensity=5000.0, color=(0.56, 0.66, 0.83), attenuation=900.0, folder="Lights"):
    a = actor_sub.spawn_actor_from_class(unreal.PointLight, web_to_ue(*center_web))
    a.set_actor_label(name); a.set_folder_path(folder)
    c = a.light_component
    c.set_intensity(intensity)
    c.set_light_color(unreal.LinearColor(*color, 1.0))
    c.set_attenuation_radius(attenuation)
    return a

def text(name, center_web, msg, size=24.0, folder="Labels"):
    a = actor_sub.spawn_actor_from_class(unreal.TextRenderActor, web_to_ue(*center_web))
    a.set_actor_label(name); a.set_folder_path(folder)
    a.text_render.set_text(unreal.Text(msg))
    a.text_render.set_world_size(size)
    a.text_render.set_horizontal_alignment(unreal.HorizTextAligment.EHTA_CENTER)
    a.set_actor_rotation(unreal.Rotator(0, 180, 0), False)  # mira hacia -X (hacia la camara que avanza en +X)
    return a

# ---------- 1. Arquitectura ----------
box("Piso", (0, -0.05, -45), (40, 0.1, 140))
box("Pasillo_MuroIzq", (-4, 2.5, -14), (0.4, 5, 32)); box("Pasillo_MuroDer", (4, 2.5, -14), (0.4, 5, 32))
box("Pasillo_Techo", (0, 5.1, -14), (8.4, 0.3, 32))
box("Hall_MuroIzq", (-11, 4.5, -57), (0.4, 9, 54)); box("Hall_MuroDer", (11, 4.5, -57), (0.4, 9, 54))
box("Hall_Fondo", (0, 4.5, -84), (22.4, 9, 0.4))
# portal CMF Supervisa (muro con vano + 2 puertas + sello)
box("Portal_Izq", (-7.15, 4.5, -30), (8.1, 9, 0.6)); box("Portal_Der", (7.15, 4.5, -30), (8.1, 9, 0.6)); box("Portal_Dintel", (0, 7.5, -30), (6.2, 3, 0.6))
puerta_izq = box("Portal_PuertaIzq", (-1.5, 3, -30), (3, 6, 0.5)); puerta_der = box("Portal_PuertaDer", (1.5, 3, -30), (3, 6, 0.5))
text("Portal_Texto", (0, 6.4, -29.6), "CMF SUPERVISA", 60)
# tiras de luz del pasillo
for i, z in enumerate(range(-3, -28, -4)):
    box(f"Pasillo_Tira_{i}", (0, 4.93, z), (2.4, 0.06, 0.25)); light(f"Pasillo_Luz_{i}", (0, 4.6, z), 3000, attenuation=700)

# ---------- 2. Estanteria con 18 cajas (codigos anonimizados) ----------
Z0, Z1 = -35.5, -58.5
for sd in (-1, 1):
    x = sd * 4.25
    for k, y in enumerate((0.55, 1.65, 2.75, 3.85)):
        box(f"Repisa_{'I' if sd<0 else 'D'}_{k}", (x, y, (Z0 + Z1) / 2), (1.0, 0.06, Z0 - Z1))
    z = Z0
    j = 0
    while z >= Z1:
        for dx in (-0.45, 0.45):
            box(f"Montante_{'I' if sd<0 else 'D'}_{j}", (x + dx, 2.0, z), (0.06, 4.0, 0.06)); j += 1
        z -= 2.3
    for i, z in enumerate(range(int(Z0 - 2), int(Z1), -4)):
        light(f"Estante_Luz_{'I' if sd<0 else 'D'}_{i}", (x - sd * 1.2, 3.7, z), 1500, attenuation=600)
for nombre, z in (("DIARIO", -38.3), ("SEMANAL", -42.7), ("MENSUAL", -50.6), ("TRIMESTRAL", -57.0)):
    text(f"Bahia_{nombre}", (0, 4.45, z), nombre, 30)
CAJAS = [("RD-01", -1, -38.0, 1.7, "22 / 22"), ("RD-02", 1, -38.6, 1.7, "22 / 22"), ("RS-01", -1, -41.5, 1.7, "5 / 5"), ("RS-02", 1, -42.2, 1.7, "5 / 5"),
         ("RS-03", -1, -43.8, 1.7, "4 / 4"), ("RM-01", 1, -46.0, 1.7, "1 / 1"), ("RM-02", -1, -46.6, 2.8, "1 / 1"), ("RM-03", 1, -47.8, 2.8, "1 / 1"),
         ("RM-04", -1, -48.4, 1.7, "1 / 1"), ("RM-05", 1, -49.6, 1.7, "1 / 1"), ("RM-06", -1, -50.2, 2.8, "1 / 1"), ("RM-07", 1, -51.4, 2.8, "1 / 1"),
         ("RM-08", -1, -52.0, 1.7, "1 / 1"), ("RM-09", 1, -53.2, 1.7, "1 / 1"), ("RM-10", -1, -53.8, 2.8, "1 / 1"), ("RM-11", 1, -55.0, 2.8, "1 / 1"),
         ("RM-12", -1, -55.4, 1.7, "1 / 1"), ("RT-01", 1, -57.0, 1.7, "sin vencimiento")]
for code, sd, z, y, stock in CAJAS:
    box(f"Caja_{code}", (sd * 4.05, y + 0.28, z), (0.62, 0.5, 0.92), folder="Cajas")
    text(f"Etiqueta_{code}", (sd * 3.4, y + 0.83, z), f"{code}\n{stock}", 14)

# ---------- 3. Carro, escaner, pedestal ----------
carro = box("Carro_Base", (-0.4, 0.45, -36.0), (1.05, 0.04, 0.7), folder="Carro")
for nombre, cx, cz, w, d in (("Carro_LadoI", -0.92, -36.0, 0.04, 0.7), ("Carro_LadoD", 0.12, -36.0, 0.04, 0.7), ("Carro_Frente", -0.4, -36.35, 1.05, 0.04), ("Carro_Atras", -0.4, -35.65, 1.05, 0.04)):
    box(nombre, (cx, 0.67, cz), (w, 0.44, d), folder="Carro")
box("Escaner_PosteI", (-2.5, 2, -60), (0.3, 4.2, 0.3)); box("Escaner_PosteD", (2.5, 2, -60), (0.3, 4.2, 0.3)); box("Escaner_Dintel", (0, 4.2, -60), (5.3, 0.3, 0.3))
light("Escaner_Luz", (0, 3.5, -60), 4000, color=(0.56, 0.66, 0.83), attenuation=700)
box("Pedestal", (0, 0.125, -67), (2.4, 0.25, 2.4), mesh=cylinder)
box("Cubo_BigQuery", (0, 2.2, -67), (1.3, 1.3, 1.3))
orb = box("Asistente_Orbe", (0.9, 2.2, -36), (0.36, 0.36, 0.36), mesh=sphere, folder="FX")
light("Hall_Luz_A", (0, 7, -46), 12000, attenuation=2500); light("Hall_Luz_B", (0, 7, -66), 12000, attenuation=2500)
light("Portal_Luz", (0, 3, -27), 6000, color=(0.12, 0.31, 0.55), attenuation=1200)

# ---------- 4. Camara + secuencia ----------
unreal.EditorAssetLibrary.make_directory(CONTENT_DIR)
seq = asset_tools.create_asset("SEQ_CierreMensual", CONTENT_DIR, unreal.LevelSequence, unreal.LevelSequenceFactoryNew())
seq.set_display_rate(unreal.FrameRate(FPS, 1)); seq.set_tick_resolution(unreal.FrameRate(24000, 1))
seq.set_playback_start(0); seq.set_playback_end(FPS * DUR_S)
cam = actor_sub.spawn_actor_from_class(unreal.CineCameraActor, web_to_ue(0, 1.6, 2))
cam.set_actor_label("CineCam_Principal")
cc = cam.cine_camera_component
cc.set_editor_property("current_focal_length", 27.0)
cc.set_editor_property("current_aperture", 2.8)
fs = cc.get_editor_property("focus_settings"); fs.set_editor_property("focus_method", unreal.CameraFocusMethod.MANUAL); fs.set_editor_property("manual_focus_distance", 420.0); cc.set_editor_property("focus_settings", fs)
binding = seq.add_possessable(cam)
tr = binding.add_track(unreal.MovieScene3DTransformTrack)
sec = tr.add_section(); sec.set_range(0, FPS * DUR_S)
ch = sec.get_all_channels()   # 0..2 loc XYZ, 3..5 rot XYZ (roll, pitch, yaw), 6..8 scale

# Guion: (segundo, posicion web (x,y,z), objetivo web (x,y,z)). Sin vaiven lateral: dolly recto sobre riel.
SHOTS = [
    (0,    (0, 1.6, 2),      (0, 1.7, -10)),
    (10,   (0, 1.6, 2),      (0, 1.7, -10)),
    (16,   (0, 1.6, -24),    (0, 2.3, -30)),
    (25,   (0, 1.6, -24.5),  (0, 2.4, -30)),
    (28,   (0, 1.6, -34),    (0, 1.5, -42)),
    (46,   (0, 1.6, -57.5),  (0, 1.6, -66)),
    (50,   (0, 1.6, -62),    (0, 1.7, -67)),
    (68.5, (0, 1.6, -62),    (0, 2.0, -67)),
    (68.52,(0, 1.6, -41),    (0, 2.6, -30)),
    (76,   (0, 1.6, -38.5),  (0, 2.6, -30)),
    (90,   (0, 1.6, -38.5),  (0, 2.6, -30)),
]
import math
for t, pos, look in SHOTS:
    f = unreal.FrameNumber(int(round(t * FPS)))
    p = web_to_ue(*pos); l = web_to_ue(*look)
    d = unreal.Vector(l.x - p.x, l.y - p.y, l.z - p.z)
    yaw = math.degrees(math.atan2(d.y, d.x)); pitch = math.degrees(math.atan2(d.z, math.hypot(d.x, d.y)))
    for i, v in enumerate((p.x, p.y, p.z, 0.0, pitch, yaw, 1.0, 1.0, 1.0)):
        ch[i].add_key(f, v)
# interpolacion suave en los extremos: por defecto las claves son cubicas (auto); en el pasillo (28-46) usar lineal para velocidad constante
cuts = seq.add_track(unreal.MovieSceneCameraCutTrack)
cut = cuts.add_section(); cut.set_range(0, FPS * DUR_S)
cut.set_camera_binding_id(seq.make_binding_id(binding, unreal.MovieSceneObjectBindingSpace.LOCAL))
unreal.EditorAssetLibrary.save_loaded_asset(seq)

# ---------- 5. Movie Render Queue (4K, Path Tracer, EXR) ----------
mrq = unreal.get_editor_subsystem(unreal.MoviePipelineQueueSubsystem)
queue = mrq.get_queue()
job = queue.allocate_new_job(unreal.MoviePipelineExecutorJob)
job.set_editor_property("sequence", unreal.SoftObjectPath(seq.get_path_name()))
world = unreal.EditorLevelLibrary.get_editor_world()
job.set_editor_property("map", unreal.SoftObjectPath(world.get_path_name()))
cfg = job.get_configuration()
out = cfg.find_or_add_setting_by_class(unreal.MoviePipelineOutputSetting)
out.set_editor_property("output_resolution", unreal.IntPoint(3840, 2160))
out.set_editor_property("output_frame_rate", unreal.FrameRate(FPS, 1))
out.set_editor_property("file_name_format", "cierre_mensual.{frame_number}")
cfg.find_or_add_setting_by_class(unreal.MoviePipelineImageSequenceOutput_EXR)
aa = cfg.find_or_add_setting_by_class(unreal.MoviePipelineAntiAliasingSetting)
aa.set_editor_property("spatial_sample_count", 1); aa.set_editor_property("temporal_sample_count", 8); aa.set_editor_property("override_anti_aliasing", True)
try:
    cfg.find_or_add_setting_by_class(unreal.MoviePipelineDeferredPass_PathTracer)
except Exception:
    cfg.find_or_add_setting_by_class(unreal.MoviePipelineDeferredPassBase)
unreal.log("Blockout, secuencia y trabajo de render creados. Guardar el mapa antes de renderizar; luego: Movie Render Queue > Render (Local).")
