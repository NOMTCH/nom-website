import React from 'react';

export const metadata = {
  title: 'Terms of Service | NOMSTD',
  description: 'Terms of Service for nomstd.my.id',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tight mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-a:text-accent">
          <p className="text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing our website at nomstd.my.id, you agree to be bound by these Terms of Service and agree that you are responsible for compliance with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on NOMSTD's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose or for any public display;</li>
            <li>Attempt to reverse engineer any software contained on NOMSTD's website;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on NOMSTD's website are provided on an 'as is' basis. NOMSTD makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall NOMSTD or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NOMSTD's website, even if NOMSTD or a NOMSTD authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on NOMSTD's website could include technical, typographical, or photographic errors. NOMSTD does not warrant that any of the materials on its website are accurate, complete or current. NOMSTD may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2>6. Links</h2>
          <p>
            NOMSTD has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by NOMSTD of the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2>7. Modifications</h2>
          <p>
            NOMSTD may revise these Terms of Service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Indonesia and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </div>
      </div>
    </div>
  );
}
