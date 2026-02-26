import React from 'react';
import { Facebook, Twitter, Linkedin, Share2, CheckCircle } from 'lucide-react';

const SocialShare = ({ siteTitle = "Support Hub" }) => {
  const [copied, setCopied] = React.useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(siteTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPopup = (url) => {
    window.open(url, '_blank', 'width=600,height=450');
  };

  return (
  <div className="support-share-bar-fixed">
    <span className="share-label-vertical">Promote</span>
    
    <div className="share-actions-vertical">
      <button onClick={() => openPopup(shareLinks.linkedin)} title="Share on LinkedIn" className="share-icon linkedin">
        <Linkedin size={22} />
      </button>
      
      <button onClick={() => openPopup(shareLinks.facebook)} title="Share on Facebook" className="share-icon facebook">
        <Facebook size={22} />
      </button>

      <button onClick={() => openPopup(shareLinks.twitter)} title="Share on X" className="share-icon x-corp">
        <Twitter size={22} />
      </button>

      <button onClick={handleCopy} className={`share-icon copy-link ${copied ? 'success' : ''}`} title="Copy Link">
        {copied ? <CheckCircle size={22} /> : <Share2 size={22} />}
      </button>
    </div>
  </div>
);
};

export default SocialShare;
