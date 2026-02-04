import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PDFViewer } from '@/components/content/PDFViewer';
import { VideoPlayer } from '@/components/content/VideoPlayer';
import { FileText, Video } from 'lucide-react';

export const ContentTestPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Content Viewer Test</h1>
          <p className="text-muted-foreground mt-2">
            Test PDF and Video viewers with full functionality
          </p>
        </div>

        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF Viewer
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video Player
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  PDF Viewer Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PDFViewer
                  src="/test-document.pdf"
                  title="Software Process Models - Chapter 2"
                  allowDownload={true}
                  allowCopy={true}
                  onProgress={(page, total) => {
                    console.log(`PDF Progress: Page ${page} of ${total}`);
                  }}
                  className="h-[700px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-500" />
                  Video Player Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VideoPlayer
                  src="/test-video.mp4"
                  title="Test Video"
                  allowDownload={true}
                  onProgress={(current, duration) => {
                    console.log(`Video Progress: ${Math.round((current / duration) * 100)}%`);
                  }}
                  onComplete={() => {
                    console.log('Video completed!');
                  }}
                  className="aspect-video"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Features to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">PDF Viewer</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Zoom in/out controls</li>
                  <li>✓ Page navigation (arrows)</li>
                  <li>✓ Thumbnail sidebar</li>
                  <li>✓ Search in document</li>
                  <li>✓ Rotate pages</li>
                  <li>✓ Fullscreen mode</li>
                  <li>✓ Download button</li>
                  <li>✓ Keyboard shortcuts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">Video Player</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Play/Pause controls</li>
                  <li>✓ Volume control & mute</li>
                  <li>✓ Progress bar & seek</li>
                  <li>✓ Playback speed (0.5x - 2x)</li>
                  <li>✓ Picture-in-Picture mode</li>
                  <li>✓ Fullscreen mode</li>
                  <li>✓ Skip forward/backward</li>
                  <li>✓ Keyboard shortcuts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentTestPage;
