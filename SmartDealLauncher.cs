using System;
using System.IO;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;

namespace SmartDeal
{
    static class Program
    {
        [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern void SHChangeNotify(int wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);

        private const int SHCNE_ASSOCCHANGED = 0x08000000;
        private const uint SHCNF_IDLIST = 0x0000;

        [STAThread]
        static void Main(string[] args)
        {
            string url = "https://smart-deal-m4ca.vercel.app/";
            string edgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
            string chromePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";
            string browserPath = File.Exists(edgePath) ? edgePath : (File.Exists(chromePath) ? chromePath : "");

            try
            {
                // Permanent storage in %LOCALAPPDATA%\SmartDeal
                string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string appDir = Path.Combine(localAppData, "SmartDeal");
                if (!Directory.Exists(appDir))
                {
                    Directory.CreateDirectory(appDir);
                }

                string currentExe = Assembly.GetExecutingAssembly().Location;
                string permanentExe = Path.Combine(appDir, "SmartDeal-App.exe");
                try
                {
                    if (!string.Equals(currentExe, permanentExe, StringComparison.OrdinalIgnoreCase))
                    {
                        File.Copy(currentExe, permanentExe, true);
                    }
                }
                catch { }

                string iconTarget = File.Exists(permanentExe) ? permanentExe : currentExe;

                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                    string startMenuPath = Environment.GetFolderPath(Environment.SpecialFolder.Programs);

                    // 1. Desktop Standalone Shortcut (.lnk)
                    string desktopLnk = Path.Combine(desktopPath, "SmartDeal.lnk");
                    dynamic shortcut1 = shell.CreateShortcut(desktopLnk);
                    if (!string.IsNullOrEmpty(browserPath))
                    {
                        shortcut1.TargetPath = browserPath;
                        shortcut1.Arguments = "--app=" + url;
                    }
                    else
                    {
                        shortcut1.TargetPath = url;
                    }
                    shortcut1.IconLocation = iconTarget + ",0";
                    shortcut1.Description = "SmartDeal - Smart Shopping & Price Comparison";
                    shortcut1.Save();

                    // 2. Start Menu Programs Shortcut (.lnk)
                    string startMenuLnk = Path.Combine(startMenuPath, "SmartDeal.lnk");
                    dynamic shortcut2 = shell.CreateShortcut(startMenuLnk);
                    if (!string.IsNullOrEmpty(browserPath))
                    {
                        shortcut2.TargetPath = browserPath;
                        shortcut2.Arguments = "--app=" + url;
                    }
                    else
                    {
                        shortcut2.TargetPath = url;
                    }
                    shortcut2.IconLocation = iconTarget + ",0";
                    shortcut2.Description = "SmartDeal - Smart Shopping & Price Comparison";
                    shortcut2.Save();

                    // Refresh desktop icon cache so the colorful logo appears immediately
                    try
                    {
                        SHChangeNotify(SHCNE_ASSOCCHANGED, SHCNF_IDLIST, IntPtr.Zero, IntPtr.Zero);
                    }
                    catch { }
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

            // Fallback: Default browser
            try
            {
                Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
            }
            catch { }
        }
    }
}
