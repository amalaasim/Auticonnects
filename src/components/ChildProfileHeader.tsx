import React from 'react';
import TopBarLogoutIcon from '@/components/TopBarLogoutIcon';
import signoutNew from '../assests/signout-new.png';

// Top bar shared by the child-profile onboarding pages. Sizes scale with the page (cqh) but
// never drop below phone-friendly minimums, so nothing clips on short landscape screens.
const ChildProfileHeader: React.FC = () => (
  <div
    className="absolute left-0 right-0 top-0 z-30 flex items-start justify-between px-[max(3.5cqh,16px)] pb-[max(1.1cqh,10px)] pt-[max(1.3cqh,10px)]"
    style={{
      minHeight: 'max(10cqh, 64px)',
      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.656) 6.88%, rgba(0, 0, 0, 0) 94.56%)',
    }}
  >
    <div className="flex flex-col">
      {/* m-0: Bootstrap's heading/paragraph margins otherwise push the title out of the bar. */}
      <h1 className="m-0 text-white" style={{ fontFamily: "'Chewy', cursive", fontSize: 'clamp(20px, 3.8cqh, 40px)', lineHeight: '0.95', letterSpacing: '0.02em' }}>
        Child Profile
      </h1>
      <p className="m-0 mt-[max(0.45cqh,4px)] text-white" style={{ fontFamily: "'Chewy', cursive", fontSize: 'clamp(11px, 1.4cqh, 18px)', lineHeight: '1.1' }}>
        Creation by Parent
      </p>
    </div>

    <TopBarLogoutIcon
      src={signoutNew}
      sx={{
        width: 'clamp(38px, 4.8cqh, 46px)',
        height: 'clamp(38px, 4.8cqh, 46px)',
        objectFit: 'contain',
        opacity: 1,
        marginTop: 'max(0.45cqh, 4px)',
        filter: 'brightness(1.12) contrast(1.08) drop-shadow(0 2px 6px rgba(0,0,0,0.22))',
      }}
    />
  </div>
);

export default ChildProfileHeader;
