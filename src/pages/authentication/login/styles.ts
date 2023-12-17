import { CSSProperties } from 'react';

export const layoutStyles: CSSProperties = {
  backgroundSize: 'cover',
};

export const containerStyles: CSSProperties = {
  border: 'none',
  maxWidth: '400px',
  padding: '12px',
};

export const headStyles: CSSProperties = {
  borderBottom: 0,
  padding: 0,
};

export const bodyStyles: CSSProperties = { marginTop: '32px', padding: 0 };

export const titleStyles: CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  hyphens: 'manual',
  lineHeight: '32px',
  marginBottom: 0,
  overflowWrap: 'break-word',
  textAlign: 'center',
  textOverflow: 'unset',
  whiteSpace: 'pre-wrap',
};

export const rightContainerStyles: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  position: 'relative',
  width: '100%',
};
export const centerContainerStyles: CSSProperties = {
  alignItems: 'center',
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  left: '22%',
  position: 'absolute',
  width: '100%',
  zIndex: 1,
};
