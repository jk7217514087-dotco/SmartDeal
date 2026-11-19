using System;
using System.IO;
using System.Diagnostics;
using System.Windows.Forms;

namespace SmartDeal
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            string url = "https://smart-deal-m4ca.vercel.app/";
            string iconUrl = "https://smart-deal-m4ca.vercel.app/favicon.png";

            try
            {
                // 1. Create Desktop shortcut
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string desktopFile = Path.Combine(desktopPath, "SmartDeal.url");
                CreateUrlShortcut(desktopFile, url, iconUrl);

                // 2. Create Start Menu Programs shortcut
                string startMenuPath = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
                string startMenuFile = Path.Combine(startMenuPath, "SmartDeal.url");
                CreateUrlShortcut(startMenuFile, url, iconUrl);
            }
            catch { }

            // 3. Launch in standalone App Window Mode
            string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
            string chromePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";
            string chromePathUser = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe");

            try
            {
                if (File.Exists(edgePath))
                {
                    Process.Start(edgePath, "--app=" + url + " --window-size=1280,850");
                    return;
                }
                if (File.Exists(chromePath))
                {
                    Process.Start(chromePath, "--app=" + url + " --window-size=1280,850");
                    return;
                }
                if (File.Exists(chromePathUser))
                {
                    Process.Start(chromePathUser, "--app=" + url + " --window-size=1280,850");
                    return;
                }
            }
            catch { }

            // Fallback: Default browser
            try
            {
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
            }
            catch { }
        }

        static void CreateUrlShortcut(string filePath, string targetUrl, string iconFile)
        {
            try
            {
                using (StreamWriter writer = new StreamWriter(filePath, false))
                {
                    writer.WriteLine("[InternetShortcut]");
                    writer.WriteLine("URL=" + targetUrl);
                    writer.WriteLine("IconIndex=0");
                    writer.WriteLine("IconFile=" + iconFile);
                    writer.WriteLine("HotKey=0");
                }
            }
            catch { }
        }
    }
}
