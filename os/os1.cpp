//��дһ������ʵ��FIFO��LRU��OPTҳ���û��㷨��
//���ȣ�����һ�������ҳ�����ô�������ҳ��ķ�ΧΪ0 - 9��
//��������ҳ�����ô�Ӧ�õ�ÿ���㷨������¼ÿ���㷨�����ȱҳ�����������
//ʵ���û��㷨��ҳ��֡���������Դ�1 - 7��
#include<iostream>
#include<vector>
#include<queue>
#include<time.h>
using namespace std;

//Ĭ��ҳ��֡����Ϊ5
int frame_num = 3;

//����Ϊ������ô�������ȱҳ���������
int FIFO(vector<int> rand_num)
{
	int len = rand_num.size();

	//ҳ��֡
	vector<int> frame(frame_num, -1);
	//��¼ȱҳ��������
	int count = 0;
	for (int i = 0; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			// δ����ȱҳ����
			if (page == frame[j]) {
				flag = 1;
				break;
			}
		}
		// ����ȱҳ����
		if (!flag) {
			count++;
			//��ҳ��֡�ĵ�һ��Ԫ��ɾ���������滻��ҳ���������ĩβ
			frame.erase(frame.begin());
			frame.push_back(page);
			// �����ǰҳ��֡�����
			for (int i = 0; i < frame_num; i++) {
				if (frame[i] == -1) {
					cout << "*" << " ";
				}
				else {
					cout << frame[i] << " ";
				}
			}
			cout << endl;
		}
	}
	return count;
}
//����Ϊ������ô�������ȱҳ���������
int OPT(vector<int> rand_num) 
{
	int len = rand_num.size();
	
	// ҳ��֡
	vector<int> frame(frame_num, -1);
	// ��¼ȱҳ������������ʼ��ҳ��֡�����ô�������λ��index
	int count = 0, index = 0;

	//��ʼ��ҳ��֡�б�
	for (int i = 0; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			if (page == frame[j]) {
				flag = 1;
				break;
			}
		}
		if (!flag) {
			count++;
			for (int k = 0; k < frame_num; k++) {
				if (frame[k] == -1) {
					frame[k] = page;
					break;
				}
			}
			// �����ǰҳ��֡�����
			for (int i = 0; i < frame_num; i++) {
				if (frame[i] == -1) {
					cout << "*" << " ";
				}
				else {
					cout << frame[i] << " ";
				}
			}
			cout << endl;
		}
		// ��ʼ�����
		if (count == frame_num) {
			index = i + 1;
			break;
		}
	}
	//��Ӧ�ظ���next_reference
	vector<int> next_ref(frame_num,100);
	for (int i = 0; i < frame_num; i++) {
		int current = frame[i];
		for (int j = index; j < len; j++) {
			if (rand_num[j] == current) {
				next_ref[i] = j;
				break;
			}
		}
	}

	for (int i = index; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			// δ����ȱҳ����
			if (page == frame[j]) {
				flag = 1;
				//���¸�ҳ�����һ���������к�
				int f = 0;
				for (int m = i + 1; m < len; m++) {
					if (rand_num[m] == page) {
						next_ref[j] = m;
						f = 1;
						break;
					}
				}
				// ��ҳ���������δ������
				if (!f) {
					next_ref[j] = 100;
				}
			}
		}
		// ����ȱҳ������Ҫ�滻ҳ��
		if (!flag) {
			count++;
			//������һ�����������ҳ��
			int temp = -1, it = -1;
			for (int k = 0; k < frame_num; k++) {
				if (next_ref[k] > temp) {
					temp = next_ref[k];
					it = k;
				}
			}
			frame[it] = page;//�滻ҳ��
			//���������б�
			int f = 0;
			for (int m = i + 1; m < len; m++) {
				if (rand_num[m] == page) {
					next_ref[it] = m;
					f = 1;
					break;
				}
			}
			// ���滻��ҳ�������δ������
			if (!f) {
				next_ref[it] = 100;
			}

			// ���ҳ��֡�����
			for (int i = 0; i < frame_num; i++) {
				cout << frame[i] << " ";
			}
			cout << endl;
		}
	}
	return count;
}

// ����Ϊ������ɵ����ô�������ȱҳ���������
int LRU(vector<int> rand_num) 
{
	int len = rand_num.size();
	
	// ҳ��֡
	vector<int> frame(frame_num, -1);
	// ��¼ȱҳ������������ʼ��ҳ��֡������������ô������к�index
	int count = 0, index = 0;

	//��ʼ��ҳ��֡�б�
	for (int i = 0; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			// δ����ȱҳ����
			if (page == frame[j]) {
				flag = 1;
			}
		}
		// ����ȱҳ����
		if (!flag) {
			count++;
			for (int k = 0; k < frame_num; k++) {
				if (frame[k] == -1) {
					frame[k] = page;
					break;
				}
			}
			// ���ҳ��֡���
			for (int i = 0; i < frame_num; i++) {
				if (frame[i] == -1) {
					cout << "*" << " ";
				}
				else {
					cout << frame[i] << " ";
				}
			}
			cout << endl;
		}
		// ��ʼ�����
		if (count == frame_num) {
			index = i + 1;
			break;
		}
	}
	//��Ӧ�ظ��� last_refernerce
	vector<int> last_ref(frame_num, 0);
	for (int i = 0; i < frame_num; i++) {
		int current = frame[i];
		for (int j = index - 1; j >= 0; j--) {
			if (current == rand_num[j]) {
				last_ref[i] = index - j;
				break;
			}
		}
	}

	for (int i = index; i < len; i++) {
		int page = rand_num[i];
		int flag = 0;
		for (int j = 0; j < frame_num; j++) {
			// ÿ�������ô�����һ��ҳ�棬����ҳ��ļ�������1
			last_ref[j]++;
			// δ����ȱҳ���󣬸��¸��ٴ�ʹ��ҳ�������Ϊ0
			if (page == frame[j]) {
				flag = 1;
				last_ref[j] = 0;
			}
		}
		// ����ȱҳ����
		if (!flag) {
			count++;
			//�����ʱ��û��ʹ�õ�ҳ��
			int temp = -1, it = -1;
			for (int k = 0; k < frame_num; k++) {
				if (last_ref[k] > temp) {
					temp = last_ref[k];
					it = k;
				}
			}
			// �滻ҳ�棬������Ҳ��Ϊ0
			frame[it] = page;
			last_ref[it] = 0;
			//���ҳ��֡�����
			for (int i = 0; i < frame_num; i++) {
				cout << frame[i] << " ";
			}
			cout << endl;
		}
	}

	return count;
}

int main()
{
	//�������ҳ�����ô�
	srand(time(NULL));
	int len = rand() % 50 + 1;
	vector<int> rand_num(len);
	for (int i = 0; i < len; i++) {
		rand_num[i] = rand() % 10;
		cout << rand_num[i] << " ";
	}
	cout << endl;

	cout << "ʹ��FIFO�û��㷨��" << endl;
	int count = FIFO(rand_num);
	cout << "����" << count << "��ȱҳ����" << endl;

	cout << endl;

	cout << "ʹ��OPT�û��㷨��" << endl;
	count = OPT(rand_num);
	cout << "����" << count << "��ȱҳ����" << endl;

	cout << endl;

	cout << "ʹ��LRU�û��㷨��" << endl;
	count = LRU(rand_num);
	cout << "����" << count << "��ȱҳ����" << endl;
}