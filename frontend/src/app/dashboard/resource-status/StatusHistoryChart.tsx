// 생성: frontend/src/app/dashboard/resource-status/StatusHistoryChart.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';
import Card from '../../components/layout/Card';

const ChartTitle = styled.h4`
  color: #ecf0f1;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
`;



// 12시간 전부터 현재까지 1분 단위의 Mock 데이터 생성
const generateData = () => {
  const data = [];
  const now = new Date();
  for (let i = 720; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 1000);
    
    // 시간에 따라 변동하는 자연스러운 데이터 패턴 생성
    const memoryFluctuation = Math.sin(i / 60) * 0.5 + Math.random() * 0.4 - 0.2;
    const diskFluctuation = Math.cos(i / 180) * 0.2 + Math.random() * 0.3 - 0.15;

    data.push({
      time: time.getTime(),
      memory: 56.5 + memoryFluctuation,
      disk: 46.4 + diskFluctuation,
    });
  }
  return data;
};

const mockData = generateData();

export interface ResourceLog { // [추가] 타입 export
  timestamp: string;
  memory: number;
  disk: number;
}


export default function StatusHistoryChart({ history }: { history: ResourceLog[] }) { // [수정] props 받기
  const data = history.map(log => ({
    time: new Date(log.timestamp).getTime(),
    memory: log.memory,
    disk: log.disk
  }));

  const timeFormatter = (tick: number) => {
    return new Date(tick).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <ChartTitle>Status History</ChartTitle>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
          <XAxis
            dataKey="time"
            scale="time"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={timeFormatter}
            stroke="#95a5a6"
            fontSize={12}
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            stroke="#3498db" 
            fontSize={12}
           domain={[(dataMin: number) => (Math.floor(dataMin)), (dataMax: number) => (Math.ceil(dataMax))]}
           />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#2ecc71" 
            fontSize={12}
            domain={[(dataMin: number) => (Math.floor(dataMin)), (dataMax: number) => (Math.ceil(dataMax))]}
            />
          <Tooltip
            labelFormatter={timeFormatter}
            contentStyle={{ backgroundColor: 'rgba(44, 62, 80, 0.85)', border: 'none' }}
            formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ top: -10, right: 0 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="memory"
            stroke="#3498db"
            strokeWidth={2}
            dot={false}
            name="Memory Usage (%)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="disk"
            stroke="#2ecc71"
            strokeWidth={2}
            dot={false}
            name="Disk Usage (%)"
          />
          {/* 하단 시간 범위 조절 브러시 */}
          <Brush 
             dataKey="time" 
             height={30} 
             stroke="#3498db"
             tickFormatter={timeFormatter}
             fill="rgba(44, 62, 80, 0.5)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}