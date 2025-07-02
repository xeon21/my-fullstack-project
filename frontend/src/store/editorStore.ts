// frontend/src/store/editorStore.ts
'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Content {
  type: 'image' | 'video' | 'webpage';
  src: string;
}

export interface Region {
  id: string;
  size: number;
  content: Content | null;
}

// [수정] SceneSize 타입을 '1920x158'로 변경합니다.
export type SceneSize = '1920x158' | '1920x540';

export interface Scene {
  id: string;
  name: string;
  regions: Region[];
  transitionTime: number;
  sizePreset: SceneSize;
}

export interface OverwriteConfirmState {
  sceneId: string;
  regionId: string;
  file: File;
}

const createNewScene = (name: string): Scene => ({
  id: uuidv4(),
  name,
  regions: [{ id: uuidv4(), size: 100, content: null }],
  transitionTime: 5,
  // [수정] 새 씬의 기본 크기를 '1920x158'로 변경합니다.
  sizePreset: '1920x158',
});

const createNewRegion = (): Region => ({
    id: uuidv4(),
    size: 100,
    content: null,
});

export interface SavedState {
    scenes: Scene[];
}

interface EditorState {
  scenes: Scene[];
  activeSceneId: string | null;
  selectedRegionId: { sceneId: string; regionId: string } | null;
  overwriteConfirm: OverwriteConfirmState | null;

  addScene: (name: string) => void;
  setActiveSceneId: (id: string) => void;
  updateRegionSize: (sceneId: string, newSizes: number[]) => void;
  updateRegionContent: (sceneId: string, regionId: string, content: Content | null) => void;
  setRegions: (sceneId: string, newRegions: Region[]) => void;
  setSelectedRegionId: (sceneId: string, regionId: string | null) => void;
  reset: () => void;
  resetScene: (sceneId: string) => void;
  updateSceneTransitionTime: (sceneId: string, time: number) => void;
  updateSceneSizePreset: (sceneId: string, size: SceneSize) => void;
  loadState: (savedState: SavedState) => void;
  setOverwriteConfirm: (data: OverwriteConfirmState) => void;
  clearOverwriteConfirm: () => void;

  // --- [추가] ---
  moveRegion: (sceneId: string, fromIndex: number, toIndex: number) => void;
}

const initialScene = createNewScene('기본 씬');

const initialState = {
  scenes: [initialScene],
  activeSceneId: initialScene.id,
  selectedRegionId: null,
  overwriteConfirm: null,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,

  setActiveSceneId: (id) => set({ activeSceneId: id, selectedRegionId: null }),

  addScene: (name) =>
    set((state) => {
      const newScene = createNewScene(name);
      return {
        scenes: [...state.scenes, newScene],
        activeSceneId: newScene.id,
      };
    }),

  setRegions: (sceneId, newRegions) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, regions: newRegions } : scene
      ),
      selectedRegionId: null,
    })),

  updateRegionSize: (sceneId, newSizes) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              regions: scene.regions.map((region, index) => ({
                ...region,
                size: newSizes[index],
              })),
            }
          : scene
      ),
    })),

  updateRegionContent: (sceneId, regionId, content) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              regions: scene.regions.map((region) =>
                region.id === regionId ? { ...region, content } : region
              ),
            }
          : scene
      ),
    })),

  setSelectedRegionId: (sceneId, regionId) =>
    set(state => ({
        selectedRegionId: regionId ? { sceneId, regionId } : null
    })),

  updateSceneTransitionTime: (sceneId, time) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, transitionTime: time } : scene
      ),
    })),

  updateSceneSizePreset: (sceneId, size) =>
    set((state) => ({
        scenes: state.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, sizePreset: size } : scene
        ),
    })),

  resetScene: (sceneId) =>
    set((state) => ({
        scenes: state.scenes.map((scene) =>
            scene.id === sceneId
            ? { ...scene, regions: [createNewRegion()] }
            : scene
        ),
        selectedRegionId: null,
    })),
    // --- [추가] 영역 순서 변경 액션 ---
  moveRegion: (sceneId, fromIndex, toIndex) =>
    set((state) => {
        const sceneToUpdate = state.scenes.find(s => s.id === sceneId);
        if (!sceneToUpdate) return state;

        const newRegions = Array.from(sceneToUpdate.regions);
        const [movedItem] = newRegions.splice(fromIndex, 1);
        newRegions.splice(toIndex, 0, movedItem);
        
        return {
            scenes: state.scenes.map(s => s.id === sceneId ? { ...s, regions: newRegions } : s)
        };
    }),

  loadState: (savedState) => set({
    scenes: savedState.scenes,
    activeSceneId: savedState.scenes[0]?.id || null,
    selectedRegionId: null,
  }),

  setOverwriteConfirm: (data) => set({ overwriteConfirm: data }),
  clearOverwriteConfirm: () => set({ overwriteConfirm: null }),

  reset: () => {
    const newInitialScene = createNewScene('기본 씬');
    set({
      scenes: [newInitialScene],
      activeSceneId: newInitialScene.id,
      selectedRegionId: null,
      overwriteConfirm: null,
    });
  },
}));