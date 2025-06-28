// frontend/src/app/dashboard/user-statistics/page.tsx
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

// 범용 레이아웃 컴포넌트들을 import 합니다.
import DashboardLayout from '../../components/layout/DashboardLayout';
import { GridContainer, GridItem } from '../../components/layout/Grid';

// 범용 카드 컴포넌트들을 import 합니다.
import StatisticsCard from '../StatisticsCard';
import ChartCard from '../ChartCard';

// Mock 데이터 (이전과 동일)
const barChartData = [
  { name: 'M', uv: 50 }, { name: 'T', uv: 20 }, { name: 'W', uv: 10 },
  { name: 'T', uv: 22 }, { name: 'F', uv: 5 }, { name: 'S', uv: 15 }, { name: 'S', uv: 42 },
];
const lineChartData = [
  { name: 'Apr', sales: 50 }, { name: 'May', sales: 300 }, { name: 'Jun', sales: 250 },
  { name: 'Jul', sales: 480 }, { name: 'Aug', sales: 220 }, { name: 'Sep', sales: 200 },
  { name: 'Oct', sales: 250 }, { name: 'Nov', sales: 230 }, { name: 'Dec', sales: 500 },
];


export default function UserStatisticsPage() {
  return (
    // DashboardLayout에 원하는 배경색과 패딩을 props로 전달합니다.
    <DashboardLayout $bgColor="#1c2833" $padding="2rem">
      {/* GridContainer에 아이템 간격을 props로 전달합니다. */}
      <GridContainer $gap="0.5rem">

        {/* 통계 카드 섹션 - 각 GridItem에 반응형 크기를 지정합니다. */}
        <GridItem $lg={3} $md={6} $xs={12}>
          <StatisticsCard
            icon={'🧳'}
            iconColor="#34495e"
            title="Bookings"
            count={281}
            percentage={{ color: 'success', amount: '+55%', label: 'than last week' }}
          />
        </GridItem>
        <GridItem $lg={3} $md={6} $xs={12}>
           <StatisticsCard
            icon={'🏠'}
            iconColor="#27ae60"
            title="Revenue"
            count="34k"
            percentage={{ color: 'success', amount: '+1%', label: 'than yesterday' }}
          />
        </GridItem>
        <GridItem $lg={3} $md={6} $xs={12}>
          <StatisticsCard
            icon={'👥'}
            iconColor="#e74c3c"
            title="Followers"
            count="+91"
            percentage={{ color: 'success', amount: '', label: 'Just updated' }}
          />
        </GridItem>
        <GridItem $lg={2.7} $md={6} $xs={12}>
            {/* 이 카드는 다른 스타일을 적용해봅니다. */}
          <StatisticsCard
            icon={'📈'}
            iconColor="#8e44ad"
            title="Active Users"
            count="1,204"
            percentage={{ color: 'error', amount: '-2%', label: 'than last hour' }}
          />
        </GridItem>

        {/* 차트 카드 섹션 */}
        <GridItem $lg={3.8} $md={6} $xs={12}>
          {/* ChartCard는 내부적으로 Card를 사용하므로 props를 전달할 수 있습니다. */}
          {/* 예: <ChartCard title="..." description="..." bgColor="#ffffff" ...> */}
          <ChartCard title="Website Views" description="Last Campaign Performance">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#95a5a6" fontSize={12} />
                <YAxis stroke="#95a5a6" fontSize={12}/>
                <Tooltip wrapperStyle={{ backgroundColor: '#34495e', border: 'none' }} />
                <Bar dataKey="uv" fill="#3498db" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </GridItem>

         <GridItem $lg={4} $md={6} $xs={12}>
          <ChartCard title="Daily Sales" description="(+15%) increase in today sales">
            <ResponsiveContainer width="100%" height={200}>
               <LineChart data={lineChartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                  <XAxis dataKey="name" stroke="#95a5a6" fontSize={12} />
                  <YAxis stroke="#95a5a6" fontSize={12} />
                  <Tooltip wrapperStyle={{ backgroundColor: '#34495e', border: 'none' }} />
                  <Line type="monotone" dataKey="sales" stroke="#2ecc71" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </GridItem>

        <GridItem $lg={4} $md={12} $xs={12}>
          <ChartCard title="Completed Tasks" description="Last Campaign Performance">
              <ResponsiveContainer width="100%" height={200}>
                 <LineChart data={lineChartData.map(d => ({...d, sales: d.sales * Math.random() + 50}))} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                    <XAxis dataKey="name" stroke="#95a5a6" fontSize={12} />
                    <YAxis stroke="#95a5a6" fontSize={12} />
                    <Tooltip wrapperStyle={{ backgroundColor: '#34495e', border: 'none' }} />
                    <Line type="monotone" dataKey="sales" stroke="#bdc3c7" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
                  </LineChart>
              </ResponsiveContainer>
          </ChartCard>
        </GridItem>

      </GridContainer>
    </DashboardLayout>
  );
}