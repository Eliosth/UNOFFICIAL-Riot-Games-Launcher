using System.Threading;
using System.Windows.Forms;

namespace Riot_Games_Launcher
{
    static class Program
    {
        public static Mutex Mutex { get; set; } = null;

        static void Main()
        {
            const string appName = "UNOFFICIAL Riot Games Launcher";

            Mutex = new Mutex(true, appName, out bool createdNew);

            if (!createdNew)
            {
                MessageBox.Show("Launcher is already running");
                return;
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new Form1());
        }
    }
}
