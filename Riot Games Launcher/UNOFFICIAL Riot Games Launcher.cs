using System;
using System.Diagnostics;
using System.Net;
using System.Runtime.InteropServices;
using System.Windows.Forms;



namespace Riot_Games_Launcher
{
    public partial class Form1 : Form
    {
        readonly ClientSearch ClientSearch = new ClientSearch();


        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        [DllImportAttribute("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd,
                         int Msg, int wParam, int lParam);
        [DllImportAttribute("user32.dll")]
        public static extern bool ReleaseCapture();


        public Form1()
        {
            InitializeComponent();
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            var webClient = new WebClient();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            if (!webClient.DownloadString("https://pastebin.com/9t1yMS1h").Contains("1.0.2"))
            {

                if (MessageBox.Show("New Version Avaliable", "System Update", MessageBoxButtons.OK) == DialogResult.OK)
                {
                    System.Diagnostics.Process.Start("http://urgl.me/");
                }


            }



        }

        public void wait(int milliseconds)
        {
            System.Windows.Forms.Timer timer1 = new System.Windows.Forms.Timer();
            if (milliseconds == 0 || milliseconds < 0) return;
            //Console.WriteLine("start wait timer");
            timer1.Interval = milliseconds;
            timer1.Enabled = true;
            timer1.Start();
            timer1.Tick += (s, e) =>
            {
                timer1.Enabled = false;
                timer1.Stop();
                //Console.WriteLine("stop wait timer");
            };
            while (timer1.Enabled)
            {
                Application.DoEvents();
            }
        }

        private void HideToTray()
        {
            this.WindowState = FormWindowState.Minimized;

            this.Hide();
            notifyIcon1.Visible = true;
            notifyIcon1.ShowBalloonTip(10);
        }

        private void Button2_Click(object sender, EventArgs e)
        {
            ClientSearch.StartBacon();
            try
            {
                wait(4000);
                Process.GetProcessesByName("LoR");
                HideToTray();
            }
            catch (Exception)
            {

                throw;
            }
        }
       
        private void Button3_Click(object sender, EventArgs e)
        {
            ClientSearch.StartValorant();
            try
            {
                wait(4000);
                Process.GetProcessesByName("BootstrapPackagedGame");
                HideToTray();
            }
            catch (Exception)
            {

                throw;
            }
        }

        private void Button4_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show("Do you wish to exit the launcher?", "Warning", MessageBoxButtons.YesNo) == DialogResult.Yes)
            {
                System.Windows.Forms.Application.Exit();
            }
            else
            {
                HideToTray();
            }


        }

        internal DialogResult ShowDialog(ClientSearch clientSearch)
        {
            throw new NotImplementedException();
        }

        private void Button5_Click_1(object sender, EventArgs e)
        {
            HideToTray();

        }

        private void Button1_Click(object sender, EventArgs e)
        {
            ClientSearch.StartLeagueOfLegends();
            try
            {            
                    wait(4000);
                    Process.GetProcessesByName("LeagueClient");
                    HideToTray();

            }
            catch (Exception)
            {

                throw;
            }
           

        }

        private void Form1_Load(object sender, EventArgs e)
        {

            try
            {
                ClientSearch.LoadSettings();

            }
            catch
            {

            }
            ClientSearch.SearchDirectory();



        }


        private void Button4_Click_1(object sender, EventArgs e)
        {

            ClientSearch.SearchDirectory();

        }

        private void Panel1_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);

            }
        }

        private void PictureBox4_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }



        private void PlayLolOnHover(object sender, EventArgs e)
        {
            pictureBox4.Image = null;
            pictureBox4.Image = Riot_Games_Launcher.Properties.Resources.LeagueHero;

        }

        private void PlayBaconOnHover(object sender, EventArgs e)
        {
            pictureBox4.Image = null;
            pictureBox4.Image = Riot_Games_Launcher.Properties.Resources.baconHero;
        }

        private void PlayValorantOnHover(object sender, EventArgs e)
        {
            pictureBox4.Image = null;
            pictureBox4.Image = Riot_Games_Launcher.Properties.Resources.valorantHero;
        }

        private void ExitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            System.Windows.Forms.Application.Exit();
        }

        private void LeagueOfLegendsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            ClientSearch.StartLeagueOfLegends();
        }

        private void LegendsOfRuneterraToolStripMenuItem1_Click(object sender, EventArgs e)
        {
            ClientSearch.StartBacon();
        }

        private void ValorantToolStripMenuItem_Click(object sender, EventArgs e)
        {
            ClientSearch.StartValorant();
        }

        private void NotifyIcon1_MouseDoubleClick(object sender, MouseEventArgs e)
        {

            if (this.WindowState == FormWindowState.Minimized)
            {
                this.Show();
                this.WindowState = FormWindowState.Normal;
            }


        }
    }
}
