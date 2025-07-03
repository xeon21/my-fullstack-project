// frontend/src/store/dynamicEditorStore.test.ts
import { useEditorStore, Layer } from './dynamicEditorStore';
import { act } from '@testing-library/react';

describe('dynamicEditorStore', () => {
  // 각 테스트 전에 스토어를 초기 상태로 리셋합니다.
  beforeEach(() => {
    act(() => {
      useEditorStore.getState().reset();
    });
  });

  it('새로운 씬을 추가하면, 해당 씬의 첫 번째 영역은 비어있는 layers 배열을 가져야 한다', () => {
    act(() => {
      useEditorStore.getState().addScene('테스트 씬');
    });

    const { scenes } = useEditorStore.getState();

    expect(scenes).toHaveLength(2);
    const newScene = scenes.find(s => s.name === '테스트 씬');
    expect(newScene).toBeDefined();
    expect(newScene?.regions).toHaveLength(1);
    expect(newScene?.regions[0].layers).toEqual([]);
  });

  it('addLayer 액션은 특정 영역에 새로운 레이어를 추가해야 한다', () => {
    // 1. 초기 상태의 첫 번째 씬과 영역 ID를 가져옵니다.
    const initialSceneId = useEditorStore.getState().scenes[0].id;
    const initialRegionId = useEditorStore.getState().scenes[0].regions[0].id;

    // 2. 새로운 레이어 데이터를 정의합니다.
    const newLayer: Omit<Layer, 'id'> = {
      type: 'image',
      src: 'test.jpg',
      style: { width: '100px', height: '100px' },
    };

    // 3. addLayer 액션을 실행합니다.
    act(() => {
      useEditorStore.getState().addLayer(initialSceneId, initialRegionId, newLayer);
    });

    // 4. 스토어의 상태를 다시 가져와서 검증합니다.
    const { scenes } = useEditorStore.getState();
    const targetRegion = scenes[0].regions[0];

    // - 영역의 layers 배열 길이가 1이어야 합니다.
    // - 추가된 레이어의 타입과 src가 일치해야 합니다.
    // - 레이어에 고유한 id가 부여되었는지 확인합니다.
    expect(targetRegion.layers).toHaveLength(1);
    expect(targetRegion.layers[0].type).toBe('image');
    expect(targetRegion.layers[0].src).toBe('test.jpg');
    expect(targetRegion.layers[0].id).toBeDefined();
  });
});