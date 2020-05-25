using System;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Windows.Forms;



namespace Riot_Games_Launcher
{
    public partial class Form1 : Form 
    {

        ClientSearch ClientSearch = new ClientSearch();
        Image[] images = new Image[] { Riot_Games_Launcher.Properties.Resources.PS20_Volibear_Base, Riot_Games_Launcher.Properties.Resources.valorantSlide, Riot_Games_Launcher.Properties.Resources.riotgames_3840x2160_bligewater2 };
        int i = 0;

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
            
          


        }
      

        private void pictureBox1_Click(object sender, EventArgs e)
        {

        }

        private void pictureBox2_Click(object sender, EventArgs e)
        {

        }

        private void button5_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            ClientSearch.StartBacon();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            ClientSearch.StartValorant();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            System.Windows.Forms.Application.Exit();
        }

        internal DialogResult ShowDialog(ClientSearch clientSearch)
        {
            throw new NotImplementedException();
        }

        private void button5_Click_1(object sender, EventArgs e)
        {
            this.WindowState = FormWindowState.Minimized;
           
        }

        private void button1_Click(object sender, EventArgs e)
        {
            ClientSearch.StartLeagueOfLegends();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

            try{
                ClientSearch.LoadSettings();
                
            }
            catch
            {

            }
            ClientSearch.SearchDirectory();


        }

        private void loadNextImage()
        {
            pictureBox4.Image = images[i];
            i++;

            if (i == 3)
            {
                i = 0;
            }
        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            loadNextImage();

        }

        private void button4_Click_1(object sender, EventArgs e)
        {
            ClientSearch.SearchSettings();
        }

        private void panel1_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
               
            }
        }

        private void pictureBox4_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }
    }
}
