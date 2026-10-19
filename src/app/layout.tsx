import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'LogicBay BD - Computer Hardware E-commerce',
    template: '%s',
  },
  description: 'Buy computer hardware and components at the best prices in Bangladesh',
  openGraph: {
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'LogicBay BD',
    locale: 'en_BD',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} font-sans`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function clean(node){if(!node||node.nodeType!==1||!node.attributes)return;for(var i=node.attributes.length-1;i>=0;i--){var name=node.attributes[i].name;if(name.indexOf('bis_')===0)node.removeAttribute(name);}}function walk(root){if(!root||root.nodeType!==1)return;clean(root);var nodes=root.querySelectorAll('*');for(var i=0;i<nodes.length;i++)clean(nodes[i]);}walk(document.documentElement);var observer=new MutationObserver(function(records){for(var i=0;i<records.length;i++){var record=records[i];if(record.type==='attributes')clean(record.target);else if(record.addedNodes){for(var j=0;j<record.addedNodes.length;j++)walk(record.addedNodes[j]);}}});observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true});setTimeout(function(){observer.disconnect();},5000);})();`,
          }}
        />
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}
