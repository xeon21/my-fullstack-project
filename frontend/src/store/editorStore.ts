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

export interface Scene {
  id: string;
  name: string;
  regions: Region[];
  transitionTime: number;
}

const createNewScene = (name: string): Scene => ({
  id: uuidv4(),
  name,
  regions: [{ id: uuidv4(), size: 100, content: null }],
  transitionTime: 5,
});

const createNewRegion = (): Region => ({
    id: uuidv4(),
    size: 100,
    content: null,
});

// [추가] 저장되는 파일의 전체 상태 타입 정의
export interface SavedState {
    scenes: Scene[];
}

interface EditorState {
  scenes: Scene[];
  activeSceneId: string | null;
  selectedRegionId: { sceneId: string; regionId: string } | null;

  addScene: (name: string) => void;
  setActiveSceneId: (id: string) => void;
  updateRegionSize: (sceneId: string, newSizes: number[]) => void;
  updateRegionContent: (sceneId: string, regionId: string, content: Content | null) => void;
  setRegions: (sceneId: string, newRegions: Region[]) => void;
  setSelectedRegionId: (sceneId: string, regionId: string | null) => void;
  reset: () => void;
  resetScene: (sceneId: string) => void;
  updateSceneTransitionTime: (sceneId: string, time: number) => void;
  loadState: (savedState: SavedState) => void; // [추가] 불러오기 액션
}

const initialScene = createNewScene('기본 씬');

const initialState = {
  scenes: [initialScene],
  activeSceneId: initialScene.id,
  selectedRegionId: null,
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

  resetScene: (sceneId) =>
    set((state) => ({
        scenes: state.scenes.map((scene) =>
            scene.id === sceneId
            ? { ...scene, regions: [createNewRegion()] }
            : scene
        ),
        selectedRegionId: null,
    })),
    
  // [추가] 불러온 데이터로 상태를 덮어쓰는 액션
  loadState: (savedState) => set({
    scenes: savedState.scenes,
    activeSceneId: savedState.scenes[0]?.id || null, // 첫 번째 씬을 활성화
    selectedRegionId: null,
  }),

  reset: () => {
    const newInitialScene = createNewScene('기본 씬');
    set({
      scenes: [newInitialScene],
      activeSceneId: newInitialScene.id,
      selectedRegionId: null
    });
  },
}));