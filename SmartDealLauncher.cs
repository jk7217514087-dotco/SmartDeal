using System;
using System.IO;
using System.Diagnostics;
using System.Reflection;

namespace SmartDeal
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            string url = "https://smart-deal-m4ca.vercel.app/";
            string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
            string chromePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";

            string browserPath = File.Exists(edgePath) ? edgePath : (File.Exists(chromePath) ? chromePath : "");

            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                    string startMenuPath = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
                    string exePath = Assembly.GetExecutingAssembly().Location;

                    // 1. Desktop standalone .lnk shortcut
                    string desktopLnk = Path.Combine(desktopPath, "SmartDeal.lnk");
                    dynamic shortcut1 = shell.CreateShortcut(desktopLnk);
                    if (!string.IsNullOrEmpty(browserPath))
                    {
                        shortcut1.TargetPath = browserPath;
                        shortcut1.Arguments = "--app=" + url;
                        shortcut1.IconLocation = exePath + ",0";
                    }
                    else
                    {
                        shortcut1.TargetPath = url;
                    }
                    shortcut1.Description = "SmartDeal PRO Standalone App";
                    shortcut1.Save();

                    // 2. Start Menu standalone .lnk shortcut
                    string startMenuLnk = Path.Combine(startMenuPath, "SmartDeal.lnk");
                    dynamic shortcut2 = shell.CreateShortcut(startMenuLnk);
                    if (!string.IsNullOrEmpty(browserPath))
                    {
                        shortcut2.TargetPath = browserPath;
                        shortcut2.Arguments = "--app=" + url;
                        shortcut2.IconLocation = exePath + ",0";
                    }
                    else
                    {
                        shortcut2.TargetPath = url;
                    }
                    shortcut2.Description = "SmartDeal PRO Standalone App";
                    shortcut2.Save();
                }
            }
            catch { }

            // Launch in standalone App Window Mode
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
            }
            catch { }

            try
            {
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
            }
            catch { }
        }
    }
}
