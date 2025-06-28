// frontend/src/store/editorStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; // [추가] uuid 임포트

export interface Content {
  type: 'image' | 'video' | 'webpage';
  src: string;
}

export interface Region {
  id: string;
  size: number;
  content: Content | null;
}

// [수정] 초기 상태를 별도 변수로 정의
const initialState = {
  regions: [{ id: 'region-1', size: 100, content: null }],
  selectedRegionId: null,
};

interface EditorState {
  regions: Region[];
  selectedRegionId: string | null;
  setRegions: (regions: Region[]) => void;
  updateRegionSize: (newSizes: number[]) => void;
  updateRegionContent: (regionId: string, content: Content | null) => void;
  setSelectedRegionId: (id: string | null) => void;
  reset: () => void; // [추가] reset 액션 타입 정의
}

export const useEditorStore = create<EditorState>((set) => ({
  ...initialState,
  setRegions: (newRegions) => set({ regions: newRegions, selectedRegionId: null }),
  updateRegionSize: (newSizes) =>
    set((state) => ({
      regions: state.regions.map((region, index) => ({
        ...region,
        size: newSizes[index],
      })),
    })),
  updateRegionContent: (regionId, content) =>
    set((state) => ({
      regions: state.regions.map((region) =>
        region.id === regionId ? { ...region, content } : region
      ),
    })),
  setSelectedRegionId: (id) => set({ selectedRegionId: id }),
  reset: () => set(initialState), // [추가] reset 액션 구현
}));