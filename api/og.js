// /api/og.js — Dynamic OpenGraph image for Kaito Rank Checker
import { ImageResponse } from '@vercel/og';

// Важно: Экспорт через default, НЕ function handler!
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const username = searchParams.get('user') || 'unknown';
  const rank = searchParams.get('rank') || '—';
  const project = searchParams.get('project') || '';
  const avatar = searchParams.get('avatar') || '';
  const projectName = project ? `in ${project}` : '';

  // Стили для баннера
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(120deg,#191b2c 0%,#4a40c7 70%,#5ad0ff 100%)',
        }}
      >
        <div style={{ fontSize: 42, color: '#fff', marginBottom: 40, fontWeight: 700, letterSpacing: '2px' }}>
          Kaito Rank Tracker
        </div>
        <div style={{display:'flex',alignItems:'center',marginBottom:40}}>
          {avatar ? (
            <img
              src={avatar}
              width={100}
              height={100}
              style={{
                borderRadius: 60,
                marginRight: 34,
                boxShadow: '0 6px 32px #62b3ff33',
                border: '4px solid #49e0ff',
                background: '#fff'
              }}
            />
          ) : null}
          <span style={{
            fontSize: 38,
            color: '#fff',
            fontWeight: 700,
            letterSpacing: '1px',
            textShadow: '0 2px 18px #24c2ffcc'
          }}>
            @{username}
          </span>
        </div>
        <div style={{ fontSize: 36, color: '#ffe350', fontWeight: 800, marginBottom: 24 }}>
          Top Rank: <span style={{ color: '#fff' }}>#{rank}</span>
        </div>
        {projectName && (
          <div style={{ fontSize: 27, color: '#b7f5ff', marginTop: 4 }}>
            {projectName}
          </div>
        )}
        <div style={{
          marginTop: 46, fontSize: 22, color: '#b5d3ff', opacity: 0.9
        }}>
          Try your rank — kaito-rank-checker.vercel.app
        </div>
        <div style={{
          marginTop: 24, fontSize: 17, color: '#59f7ff', opacity: 0.7, fontWeight: 600, letterSpacing: '2px'
        }}>
          By OveR
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
