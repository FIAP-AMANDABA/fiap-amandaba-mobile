import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'theme/app_colors.dart';
import 'theme/app_theme.dart';

bool _hasValidEmail(String email) => email.contains('@');

String _digitsOnly(String value) => value.replaceAll(RegExp(r'\D'), '');

bool _hasValidCpf(String value) {
  final cpf = _digitsOnly(value);
  if (cpf.length != 11 || RegExp(r'^(\d)\1{10}$').hasMatch(cpf)) return false;

  var firstSum = 0;
  for (var index = 0; index < 9; index++) {
    firstSum += int.parse(cpf[index]) * (10 - index);
  }
  var firstDigit = (firstSum * 10) % 11;
  if (firstDigit == 10) firstDigit = 0;
  if (firstDigit != int.parse(cpf[9])) return false;

  var secondSum = 0;
  for (var index = 0; index < 10; index++) {
    secondSum += int.parse(cpf[index]) * (11 - index);
  }
  var secondDigit = (secondSum * 10) % 11;
  if (secondDigit == 10) secondDigit = 0;
  return secondDigit == int.parse(cpf[10]);
}

bool _hasValidBirthDate(String value) {
  final match = RegExp(r'^(\d{2})/(\d{2})/(\d{4})$').firstMatch(value.trim());
  if (match == null) return false;
  final day = int.parse(match.group(1)!);
  final month = int.parse(match.group(2)!);
  final year = int.parse(match.group(3)!);
  final date = DateTime(year, month, day);
  final today = DateTime.now();
  return year >= 1900 &&
      date.year == year &&
      date.month == month &&
      date.day == day &&
      !date.isAfter(DateTime(today.year, today.month, today.day));
}

bool _hasValidPhone(String value) {
  final phone = _digitsOnly(value);
  return (phone.length == 10 || phone.length == 11) && phone[0] != '0';
}

class _DigitsMaskFormatter extends TextInputFormatter {
  final int maxDigits;
  final String Function(String) format;

  _DigitsMaskFormatter({required this.maxDigits, required this.format});

  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final digits = _digitsOnly(newValue.text);
    final limitedDigits = digits.length > maxDigits ? digits.substring(0, maxDigits) : digits;
    final formatted = format(limitedDigits);
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

String _formatCpf(String digits) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return '${digits.substring(0, 3)}.${digits.substring(3)}';
  if (digits.length <= 9) return '${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}';
  return '${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9)}';
}

String _formatBirthDate(String digits) {
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return '${digits.substring(0, 2)}/${digits.substring(2)}';
  return '${digits.substring(0, 2)}/${digits.substring(2, 4)}/${digits.substring(4)}';
}

String _formatPhone(String digits) {
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return '(${digits.substring(0, 2)}) ${digits.substring(2)}';
  if (digits.length <= 10) return '(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}';
  return '(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}';
}

class PetRecord {
  final String id;
  final String name;
  final String species;
  final String breed;
  final String sex;
  final String birthDate;
  final String color;
  final bool neutered;
  final String microchip;
  final String? photo;
  final bool active;

  const PetRecord({
    required this.id,
    required this.name,
    required this.species,
    required this.breed,
    required this.sex,
    required this.birthDate,
    required this.color,
    required this.neutered,
    required this.microchip,
    required this.photo,
    this.active = true,
  });

  PetRecord copyWith({
    String? name,
    String? species,
    String? breed,
    String? sex,
    String? birthDate,
    String? color,
    bool? neutered,
    String? microchip,
    String? photo,
    bool? active,
  }) => PetRecord(
    id: id,
    name: name ?? this.name,
    species: species ?? this.species,
    breed: breed ?? this.breed,
    sex: sex ?? this.sex,
    birthDate: birthDate ?? this.birthDate,
    color: color ?? this.color,
    neutered: neutered ?? this.neutered,
    microchip: microchip ?? this.microchip,
    photo: photo ?? this.photo,
    active: active ?? this.active,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'species': species,
    'breed': breed,
    'sex': sex,
    'birthDate': birthDate,
    'color': color,
    'neutered': neutered,
    'microchip': microchip,
    'photo': photo,
    'active': active,
  };

  factory PetRecord.fromJson(Map<String, dynamic> json) => PetRecord(
    id: json['id'] as String,
    name: json['name'] as String? ?? '',
    species: json['species'] as String? ?? '',
    breed: json['breed'] as String? ?? '',
    sex: json['sex'] as String? ?? '',
    birthDate: json['birthDate'] as String? ?? '',
    color: json['color'] as String? ?? '',
    neutered: json['neutered'] as bool? ?? false,
    microchip: json['microchip'] as String? ?? '',
    photo: json['photo'] as String?,
    active: json['active'] as bool? ?? true,
  );
}

Future<List<PetRecord>> _loadPets() async {
  final preferences = await SharedPreferences.getInstance();
  final rawPets = preferences.getStringList('account_pets') ?? [];
  return rawPets
      .map((rawPet) => PetRecord.fromJson(jsonDecode(rawPet) as Map<String, dynamic>))
      .where((pet) => pet.active)
      .toList();
}

Future<void> _savePets(List<PetRecord> pets) async {
  final preferences = await SharedPreferences.getInstance();
  await preferences.setStringList(
    'account_pets',
    pets.map((pet) => jsonEncode(pet.toJson())).toList(),
  );
}

void main() {
  runApp(const AmandabaApp());
}

class AmandabaApp extends StatelessWidget {
  const AmandabaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Amandaba',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_hasValidEmail(_emailController.text.trim())) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Digite um e-mail válido com @.')),
      );
      return;
    }

    final preferences = await SharedPreferences.getInstance();
    final savedEmail = preferences.getString('account_email');
    final savedPassword = preferences.getString('account_password');
    if (!mounted) return;

    if (savedEmail == null || savedPassword == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Crie sua conta antes de entrar.')),
      );
      return;
    }

    if (_emailController.text.trim() != savedEmail || _passwordController.text != savedPassword) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('E-mail ou senha incorretos.')),
      );
      return;
    }

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HomePage()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(28, 42, 28, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const BrandMark(),
              const SizedBox(height: 54),
              Text('Bem-vindo de volta!', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 10),
              const Text('Cuide da saúde do seu pet em um só lugar.', style: TextStyle(fontSize: 16, color: AppColors.muted, height: 1.4)),
              const SizedBox(height: 36),
              const FieldLabel('E-mail'),
              TextField(controller: _emailController, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(hintText: 'seu@email.com', prefixIcon: Icon(Icons.mail_outline_rounded))),
              const SizedBox(height: 20),
              const FieldLabel('Senha'),
              TextField(controller: _passwordController, obscureText: _obscurePassword, decoration: InputDecoration(hintText: 'Digite sua senha', prefixIcon: const Icon(Icons.lock_outline_rounded), suffixIcon: IconButton(tooltip: 'Mostrar senha', onPressed: () => setState(() => _obscurePassword = !_obscurePassword), icon: Icon(_obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined)))),
              Align(alignment: Alignment.centerRight, child: TextButton(onPressed: () {}, child: const Text('Esqueci minha senha'))),
              const SizedBox(height: 20),
              PrimaryButton(label: 'Entrar', icon: Icons.arrow_forward_rounded, onPressed: _login),
              const SizedBox(height: 26),
              Row(children: [const Expanded(child: Divider()), Padding(padding: const EdgeInsets.symmetric(horizontal: 14), child: Text('ou', style: TextStyle(color: Colors.grey))), const Expanded(child: Divider())]),
              const SizedBox(height: 26),
              Center(child: TextButton(onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const RegisterPage())), child: const Text('Ainda não tenho uma conta  •  Criar cadastro'))),
            ],
          ),
        ),
      ),
    );
  }
}

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _nameController = TextEditingController();
  final _cpfController = TextEditingController();
  final _birthDateController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _cpfController.dispose();
    _birthDateController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _createAccount() async {
    if (_nameController.text.trim().isEmpty ||
        _cpfController.text.trim().isEmpty ||
        _birthDateController.text.trim().isEmpty ||
        _phoneController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Preencha todos os dados do cadastro.')),
      );
      return;
    }

    if (!_hasValidCpf(_cpfController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe um CPF válido.')));
      return;
    }
    if (!_hasValidBirthDate(_birthDateController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe uma data de nascimento válida (DD/MM/AAAA).')));
      return;
    }
    if (!_hasValidPhone(_phoneController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe um telefone válido com DDD.')));
      return;
    }

    if (!_hasValidEmail(_emailController.text.trim())) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Digite um e-mail válido com @.')),
      );
      return;
    }

    if (_passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Digite uma senha para continuar.')),
      );
      return;
    }

    final preferences = await SharedPreferences.getInstance();
    await preferences.setString('account_name', _nameController.text.trim());
    await preferences.setString('account_cpf', _cpfController.text.trim());
    await preferences.setString('account_birth_date', _birthDateController.text.trim());
    await preferences.setString('account_email', _emailController.text.trim());
    await preferences.setString('account_phone', _phoneController.text.trim());
    await preferences.setString('account_password', _passwordController.text);
    if (!mounted) return;

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0, leading: IconButton(icon: const Icon(Icons.arrow_back_rounded), onPressed: () => Navigator.pop(context))),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(28, 12, 28, 24),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const BrandMark(),
            const SizedBox(height: 34),
            Text('Crie sua conta', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 10),
            const Text('Comece a acompanhar cada momento da saúde do seu pet.', style: TextStyle(fontSize: 16, color: AppColors.muted, height: 1.4)),
            const SizedBox(height: 32),
            const FieldLabel('Seu nome'),
            TextField(controller: _nameController, decoration: const InputDecoration(hintText: 'Como podemos chamar você?', prefixIcon: Icon(Icons.person_outline_rounded))),
            const SizedBox(height: 18),
            const FieldLabel('CPF'),
            TextField(controller: _cpfController, keyboardType: TextInputType.number, inputFormatters: [_DigitsMaskFormatter(maxDigits: 11, format: _formatCpf)], decoration: const InputDecoration(hintText: '000.000.000-00', prefixIcon: Icon(Icons.badge_outlined))),
            const SizedBox(height: 18),
            const FieldLabel('Data de nascimento'),
            TextField(controller: _birthDateController, keyboardType: TextInputType.datetime, inputFormatters: [_DigitsMaskFormatter(maxDigits: 8, format: _formatBirthDate)], decoration: const InputDecoration(hintText: 'DD/MM/AAAA', prefixIcon: Icon(Icons.cake_outlined))),
            const SizedBox(height: 18),
            const FieldLabel('E-mail'),
            TextField(controller: _emailController, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(hintText: 'seu@email.com', prefixIcon: Icon(Icons.mail_outline_rounded))),
            const SizedBox(height: 18),
            const FieldLabel('Telefone'),
            TextField(controller: _phoneController, keyboardType: TextInputType.phone, inputFormatters: [_DigitsMaskFormatter(maxDigits: 11, format: _formatPhone)], decoration: const InputDecoration(hintText: '(00) 00000-0000', prefixIcon: Icon(Icons.phone_outlined))),
            const SizedBox(height: 18),
            const FieldLabel('Crie uma senha'),
            TextField(controller: _passwordController, obscureText: true, decoration: const InputDecoration(hintText: 'Mínimo de 8 caracteres', prefixIcon: Icon(Icons.lock_outline_rounded))),
            const SizedBox(height: 30),
            PrimaryButton(label: 'Criar minha conta', icon: Icons.pets_rounded, onPressed: _createAccount),
            const SizedBox(height: 18),
            const Center(child: Text('Ao continuar, você concorda com nossos termos de uso.', textAlign: TextAlign.center, style: TextStyle(fontSize: 12, color: AppColors.mutedLight)),),
          ]),
        ),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  List<PetRecord> _pets = [];

  @override
  void initState() {
    super.initState();
    _refreshPets();
    _loadUserName();
  }

  Future<void> _refreshPets() async {
    final pets = await _loadPets();
    if (mounted) setState(() => _pets = pets);
  }

  String _userName = 'Tutor';

  Future<void> _loadUserName() async {
    final preferences = await SharedPreferences.getInstance();
    if (!mounted) return;
    setState(() => _userName = preferences.getString('account_name') ?? 'Tutor');
  }

  void _logout() {
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: _buildCurrentPage(context)),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) => setState(() => _selectedIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home_rounded), label: 'Início'),
          NavigationDestination(icon: Icon(Icons.calendar_month_outlined), selectedIcon: Icon(Icons.calendar_month_rounded), label: 'Agenda'),
          NavigationDestination(icon: Icon(Icons.description_outlined), selectedIcon: Icon(Icons.description_rounded), label: 'Histórico'),
          NavigationDestination(icon: Icon(Icons.person_outline_rounded), selectedIcon: Icon(Icons.person_rounded), label: 'Perfil'),
        ],
      ),
    );
  }

  Widget _buildCurrentPage(BuildContext context) {
    if (_selectedIndex == 0) return _buildOverview(context);
    if (_selectedIndex == 3) return const ProfilePage();
    return _buildPlaceholder();
  }

  Widget _buildOverview(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(22, 26, 22, 24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, crossAxisAlignment: CrossAxisAlignment.start, children: [
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Olá, $_userName', style: const TextStyle(fontSize: 16, color: AppColors.muted)), const SizedBox(height: 5), Text('Como estão seus pets?', style: Theme.of(context).textTheme.titleLarge) ]),
          Row(children: [
            Container(width: 48, height: 48, decoration: BoxDecoration(color: AppColors.paleGreen, borderRadius: BorderRadius.circular(16)), child: const Icon(Icons.notifications_none_rounded, color: AppColors.greenDark)),
            const SizedBox(width: 8),
            IconButton(tooltip: 'Encerrar sessão', onPressed: _logout, icon: const Icon(Icons.logout_rounded, color: AppColors.greenDark)),
          ]),
        ]),
        const SizedBox(height: 26),
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          const SectionTitle(title: 'Seus pets'),
          TextButton.icon(onPressed: () async { await Navigator.of(context).push(MaterialPageRoute(builder: (_) => const PetFormPage())); _refreshPets(); }, icon: const Icon(Icons.add_rounded, size: 18), label: const Text('Adicionar')),
        ]),
        if (_pets.isEmpty)
          const EmptyState(message: 'Cadastre seu primeiro pet para acompanhar a saúde dele.')
        else
          SizedBox(
            height: 108,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _pets.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (_, index) => PetSummaryCard(pet: _pets[index], onTap: () async { await Navigator.of(context).push(MaterialPageRoute(builder: (_) => PetFormPage(pet: _pets[index]))); _refreshPets(); }),
            ),
          ),
        const SizedBox(height: 26),
        Container(padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: AppColors.charcoal, borderRadius: BorderRadius.circular(24)), child: Row(children: [
          Container(width: 68, height: 68, decoration: BoxDecoration(color: Colors.white.withOpacity(.2), shape: BoxShape.circle), child: Center(child: _pets.isEmpty ? const Text('🐶', style: TextStyle(fontSize: 38)) : PetAvatar(pet: _pets.first, size: 56))),
          const SizedBox(width: 16),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(_pets.isEmpty ? 'Nenhum pet cadastrado' : _pets.first.name, style: const TextStyle(color: AppColors.white, fontSize: 22, fontWeight: FontWeight.w800)), const SizedBox(height: 4), const Text('Próxima vacina em 12 dias', style: TextStyle(color: AppColors.greenTint, fontSize: 13)), const SizedBox(height: 12), const Text('Acompanhe os cuidados do seu pet', style: TextStyle(color: AppColors.white, fontWeight: FontWeight.w700))])),
        ])),
        const SizedBox(height: 28),
        const SectionTitle(title: 'Acompanhamento de hoje', action: 'Ver tudo'),
        const SizedBox(height: 14),
        Row(children: [
          Expanded(child: MetricCard(icon: Icons.monitor_heart_outlined, value: '2', label: 'cuidados pendentes', color: AppColors.warm)),
          const SizedBox(width: 12),
          Expanded(child: MetricCard(icon: Icons.favorite_border_rounded, value: '96%', label: 'saúde geral', color: AppColors.paleGreen)),
        ]),
        const SizedBox(height: 28),
        const SectionTitle(title: 'Próximos cuidados'),
        const SizedBox(height: 12),
        const CareItem(icon: Icons.medication_outlined, title: 'Antipulgas', detail: 'Hoje, às 19:00', tag: 'Luna', color: AppColors.warmSoft),
        const SizedBox(height: 10),
        const CareItem(icon: Icons.vaccines_outlined, title: 'Vacina antirrábica', detail: '18 de setembro, às 10:30', tag: 'Luna', color: AppColors.coolPale),
        const SizedBox(height: 28),
        const SectionTitle(title: 'Resumo de saúde'),
        const SizedBox(height: 12),
        const HealthInfo(icon: Icons.event_available_rounded, title: 'Próximas consultas', detail: 'Nenhuma consulta agendada para esta semana.'),
        const HealthInfo(icon: Icons.history_rounded, title: 'Consultas recentes', detail: 'Histórico pronto para receber seus registros.'),
        const HealthInfo(icon: Icons.science_outlined, title: 'Exames recentes', detail: 'Nenhum exame recente cadastrado.'),
        const HealthInfo(icon: Icons.warning_amber_rounded, title: 'Vacinas atrasadas', detail: 'Mantenha a carteira de vacinação atualizada.'),
        const SizedBox(height: 28),
        const SectionTitle(title: 'Acesso rápido'),
        const SizedBox(height: 14),
        Row(children: [
          Expanded(child: QuickAction(icon: Icons.add_circle_outline_rounded, label: 'Novo registro', onPressed: () {})),
          const SizedBox(width: 12),
          Expanded(child: QuickAction(icon: Icons.local_hospital_outlined, label: 'Encontrar clínica', onPressed: () {})),
          const SizedBox(width: 12),
          Expanded(child: QuickAction(icon: Icons.chat_bubble_outline_rounded, label: 'Falar com vet', onPressed: () {})),
        ]),
      ]),
    );
  }

  Widget _buildPlaceholder() => Center(child: Text('Em breve', style: Theme.of(context).textTheme.titleLarge));
}

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _nameController = TextEditingController();
  final _cpfController = TextEditingController();
  final _birthDateController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _editing = false;
  bool _changingPassword = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final preferences = await SharedPreferences.getInstance();
    _nameController.text = preferences.getString('account_name') ?? '';
    _cpfController.text = preferences.getString('account_cpf') ?? '';
    _birthDateController.text = preferences.getString('account_birth_date') ?? '';
    _emailController.text = preferences.getString('account_email') ?? '';
    _phoneController.text = preferences.getString('account_phone') ?? '';
    if (mounted) setState(() {});
  }

  @override
  void dispose() {
    _nameController.dispose();
    _cpfController.dispose();
    _birthDateController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    if (_nameController.text.trim().isEmpty || !_hasValidEmail(_emailController.text.trim())) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe um nome e um e-mail válido.')));
      return;
    }
    if (!_hasValidCpf(_cpfController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe um CPF válido.')));
      return;
    }
    if (!_hasValidBirthDate(_birthDateController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe uma data de nascimento válida (DD/MM/AAAA).')));
      return;
    }
    if (!_hasValidPhone(_phoneController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe um telefone válido com DDD.')));
      return;
    }
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString('account_name', _nameController.text.trim());
    await preferences.setString('account_cpf', _cpfController.text.trim());
    await preferences.setString('account_birth_date', _birthDateController.text.trim());
    await preferences.setString('account_email', _emailController.text.trim());
    await preferences.setString('account_phone', _phoneController.text.trim());
    if (mounted) {
      setState(() => _editing = false);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Perfil atualizado.')));
    }
  }

  Future<void> _changePassword() async {
    if (_passwordController.text.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('A senha deve ter pelo menos 6 caracteres.')));
      return;
    }
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString('account_password', _passwordController.text);
    _passwordController.clear();
    if (mounted) {
      setState(() => _changingPassword = false);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Senha alterada com sucesso.')));
    }
  }

  Future<void> _deactivateAccount() async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.remove('account_name');
    await preferences.remove('account_cpf');
    await preferences.remove('account_birth_date');
    await preferences.remove('account_email');
    await preferences.remove('account_phone');
    await preferences.remove('account_password');
    await preferences.remove('account_pets');
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (_) => const LoginPage()), (route) => false);
  }

  Widget _profileField(String label, TextEditingController controller, IconData icon, {TextInputType? keyboardType, TextInputFormatter? formatter}) => TextField(
    controller: controller,
    enabled: _editing,
    keyboardType: keyboardType,
    inputFormatters: formatter == null ? null : [formatter],
    decoration: InputDecoration(labelText: label, prefixIcon: Icon(icon)),
  );

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(22, 26, 22, 32),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Meu perfil', style: Theme.of(context).textTheme.headlineSmall),
          IconButton(tooltip: _editing ? 'Salvar perfil' : 'Editar perfil', onPressed: _editing ? _saveProfile : () => setState(() => _editing = true), icon: Icon(_editing ? Icons.check_rounded : Icons.edit_outlined, color: AppColors.greenDark)),
        ]),
        const SizedBox(height: 22),
        _profileField('Nome completo', _nameController, Icons.person_outline_rounded),
        const SizedBox(height: 14),
          _profileField('CPF', _cpfController, Icons.badge_outlined, keyboardType: TextInputType.number, formatter: _DigitsMaskFormatter(maxDigits: 11, format: _formatCpf)),
        const SizedBox(height: 14),
          _profileField('Data de nascimento', _birthDateController, Icons.cake_outlined, formatter: _DigitsMaskFormatter(maxDigits: 8, format: _formatBirthDate)),
        const SizedBox(height: 14),
        _profileField('E-mail', _emailController, Icons.mail_outline_rounded, keyboardType: TextInputType.emailAddress),
        const SizedBox(height: 14),
        _profileField('Telefone', _phoneController, Icons.phone_outlined, keyboardType: TextInputType.phone, formatter: _DigitsMaskFormatter(maxDigits: 11, format: _formatPhone)),
        const SizedBox(height: 28),
        SectionTitle(title: 'Segurança', action: _changingPassword ? null : 'Alterar senha'),
        if (!_changingPassword)
          Align(alignment: Alignment.centerLeft, child: TextButton.icon(onPressed: () => setState(() => _changingPassword = true), icon: const Icon(Icons.lock_outline_rounded), label: const Text('Definir nova senha')))
        else ...[
          const SizedBox(height: 12),
          TextField(controller: _passwordController, obscureText: true, decoration: const InputDecoration(labelText: 'Nova senha', prefixIcon: Icon(Icons.lock_outline_rounded))),
          const SizedBox(height: 10),
          Row(children: [TextButton(onPressed: () => setState(() => _changingPassword = false), child: const Text('Cancelar')), const SizedBox(width: 8), FilledButton(onPressed: _changePassword, child: const Text('Salvar senha'))]),
        ],
        const SizedBox(height: 28),
        const SectionTitle(title: 'Conta'),
        const SizedBox(height: 10),
        OutlinedButton.icon(onPressed: _deactivateAccount, icon: const Icon(Icons.person_off_outlined), label: const Text('Desativar conta'), style: OutlinedButton.styleFrom(foregroundColor: Colors.redAccent)),
      ]),
    );
  }
}

class PetFormPage extends StatefulWidget {
  final PetRecord? pet;
  const PetFormPage({this.pet, super.key});

  @override
  State<PetFormPage> createState() => _PetFormPageState();
}

class _PetFormPageState extends State<PetFormPage> {
  final _nameController = TextEditingController();
  final _speciesController = TextEditingController();
  final _breedController = TextEditingController();
  final _birthDateController = TextEditingController();
  final _colorController = TextEditingController();
  final _microchipController = TextEditingController();
  final _picker = ImagePicker();
  String _sex = 'Não informado';
  bool _neutered = false;
  String? _photo;

  @override
  void initState() {
    super.initState();
    final pet = widget.pet;
    if (pet != null) {
      _nameController.text = pet.name;
      _speciesController.text = pet.species;
      _breedController.text = pet.breed;
      _birthDateController.text = pet.birthDate;
      _colorController.text = pet.color;
      _microchipController.text = pet.microchip;
      _sex = pet.sex;
      _neutered = pet.neutered;
      _photo = pet.photo;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _speciesController.dispose();
    _breedController.dispose();
    _birthDateController.dispose();
    _colorController.dispose();
    _microchipController.dispose();
    super.dispose();
  }

  Future<void> _pickPhoto() async {
    final file = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 75, maxWidth: 800);
    if (file == null) return;
    final bytes = await file.readAsBytes();
    setState(() => _photo = base64Encode(bytes));
  }

  Future<void> _savePet() async {
    if (_nameController.text.trim().isEmpty || _speciesController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe pelo menos o nome e a espécie.')));
      return;
    }
    if (_birthDateController.text.trim().isNotEmpty && !_hasValidBirthDate(_birthDateController.text)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe uma data de nascimento válida (DD/MM/AAAA).')));
      return;
    }
    final pet = PetRecord(
      id: widget.pet?.id ?? DateTime.now().microsecondsSinceEpoch.toString(),
      name: _nameController.text.trim(),
      species: _speciesController.text.trim(),
      breed: _breedController.text.trim(),
      sex: _sex,
      birthDate: _birthDateController.text.trim(),
      color: _colorController.text.trim(),
      neutered: _neutered,
      microchip: _microchipController.text.trim(),
      photo: _photo,
    );
    final pets = await _loadPets();
    final index = pets.indexWhere((item) => item.id == pet.id);
    if (index == -1) {
      pets.add(pet);
    } else {
      pets[index] = pet;
    }
    await _savePets(pets);
    if (mounted) Navigator.pop(context);
  }

  Future<void> _deactivatePet() async {
    if (widget.pet == null) return;
    final pets = await _loadPets();
    pets.removeWhere((pet) => pet.id == widget.pet!.id);
    await _savePets(pets);
    if (mounted) Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final editing = widget.pet != null;
    return Scaffold(
      appBar: AppBar(title: Text(editing ? 'Editar pet' : 'Novo pet'), actions: [if (editing) IconButton(tooltip: 'Desativar pet', onPressed: _deactivatePet, icon: const Icon(Icons.delete_outline_rounded))]),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(22, 14, 22, 32),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Center(child: GestureDetector(onTap: _pickPhoto, child: PetAvatar(pet: PetRecord(id: '', name: '', species: '', breed: '', sex: '', birthDate: '', color: '', neutered: false, microchip: '', photo: _photo), size: 96, showAdd: true))),
          const SizedBox(height: 22),
          const FieldLabel('Nome do pet'),
          TextField(controller: _nameController, decoration: const InputDecoration(hintText: 'Ex.: Luna', prefixIcon: Icon(Icons.pets_rounded))),
          const SizedBox(height: 16),
          const FieldLabel('Espécie'),
          TextField(controller: _speciesController, decoration: const InputDecoration(hintText: 'Cachorro, gato...', prefixIcon: Icon(Icons.category_outlined))),
          const SizedBox(height: 16),
          const FieldLabel('Raça'),
          TextField(controller: _breedController, decoration: const InputDecoration(hintText: 'Ex.: Golden Retriever', prefixIcon: Icon(Icons.pets_outlined))),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(value: _sex, decoration: const InputDecoration(labelText: 'Sexo', prefixIcon: Icon(Icons.wc_outlined)), items: const ['Não informado', 'Macho', 'Fêmea'].map((sex) => DropdownMenuItem(value: sex, child: Text(sex))).toList(), onChanged: (value) => setState(() => _sex = value ?? 'Não informado')),
          const SizedBox(height: 16),
          TextField(controller: _birthDateController, keyboardType: TextInputType.datetime, inputFormatters: [_DigitsMaskFormatter(maxDigits: 8, format: _formatBirthDate)], decoration: const InputDecoration(labelText: 'Data de nascimento', hintText: 'DD/MM/AAAA', prefixIcon: Icon(Icons.cake_outlined))),
          const SizedBox(height: 16),
          TextField(controller: _colorController, decoration: const InputDecoration(labelText: 'Cor', prefixIcon: Icon(Icons.palette_outlined))),
          const SizedBox(height: 8),
          SwitchListTile(contentPadding: EdgeInsets.zero, title: const Text('É castrado?'), value: _neutered, onChanged: (value) => setState(() => _neutered = value)),
          TextField(controller: _microchipController, decoration: const InputDecoration(labelText: 'Número do microchip', prefixIcon: Icon(Icons.qr_code_2_rounded))),
          const SizedBox(height: 26),
          PrimaryButton(label: editing ? 'Salvar alterações' : 'Cadastrar pet', icon: Icons.check_rounded, onPressed: _savePet),
        ]),
      ),
    );
  }
}

class PetAvatar extends StatelessWidget {
  final PetRecord pet;
  final double size;
  final bool showAdd;
  const PetAvatar({required this.pet, required this.size, this.showAdd = false, super.key});

  @override
  Widget build(BuildContext context) {
    final hasPhoto = pet.photo != null && pet.photo!.isNotEmpty;
    return Container(
      width: size,
      height: size,
      decoration: const BoxDecoration(color: AppColors.paleGreen, shape: BoxShape.circle),
      clipBehavior: Clip.antiAlias,
      child: hasPhoto ? Image.memory(base64Decode(pet.photo!), fit: BoxFit.cover) : Stack(alignment: Alignment.center, children: [const Icon(Icons.pets_rounded, color: AppColors.greenDark, size: 38), if (showAdd) const Positioned(right: 2, bottom: 2, child: CircleAvatar(radius: 15, backgroundColor: AppColors.charcoal, child: Icon(Icons.add, size: 18, color: AppColors.white)))]),
    );
  }
}

class PetSummaryCard extends StatelessWidget {
  final PetRecord pet;
  final VoidCallback onTap;
  const PetSummaryCard({required this.pet, required this.onTap, super.key});

  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onTap,
    borderRadius: BorderRadius.circular(16),
    child: Container(
      width: 190,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          PetAvatar(pet: pet, size: 58),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(pet.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.ink)),
                const SizedBox(height: 4),
                Text(pet.species, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: AppColors.muted)),
                const SizedBox(height: 5),
                const Text('Ver perfil', style: TextStyle(fontSize: 11, color: AppColors.greenDark, fontWeight: FontWeight.w700)),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}

class EmptyState extends StatelessWidget {
  final String message;
  const EmptyState({required this.message, super.key});

  @override
  Widget build(BuildContext context) => Container(width: double.infinity, padding: const EdgeInsets.all(18), decoration: BoxDecoration(color: AppColors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)), child: Text(message, style: const TextStyle(color: AppColors.muted)));
}

class HealthInfo extends StatelessWidget {
  final IconData icon;
  final String title;
  final String detail;
  const HealthInfo({required this.icon, required this.title, required this.detail, super.key});

  @override
  Widget build(BuildContext context) => ListTile(contentPadding: EdgeInsets.zero, leading: CircleAvatar(backgroundColor: AppColors.paleGreen, child: Icon(icon, color: AppColors.greenDark)), title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.ink)), subtitle: Text(detail));
}

class BrandMark extends StatelessWidget {
  const BrandMark({super.key});

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 170,
    height: 170,
    child: Image.asset('web/icons/logo.jpeg', fit: BoxFit.contain),
  );
}

class FieldLabel extends StatelessWidget {
  final String text;
  const FieldLabel(this.text, {super.key});
  @override
  Widget build(BuildContext context) => Padding(padding: const EdgeInsets.only(bottom: 8), child: Text(text, style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.greenDark)));
}

class PrimaryButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onPressed;
  const PrimaryButton({required this.label, required this.icon, required this.onPressed, super.key});
  @override
  Widget build(BuildContext context) => SizedBox(width: double.infinity, height: 56, child: FilledButton.icon(onPressed: onPressed, icon: Icon(icon, size: 20), label: Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700))));
}

class SectionTitle extends StatelessWidget {
  final String title;
  final String? action;
  const SectionTitle({required this.title, this.action, super.key});
  @override
  Widget build(BuildContext context) => Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.ink)), if (action != null) Text(action!, style: const TextStyle(color: AppColors.greenDark, fontWeight: FontWeight.w700))]);
}

class MetricCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;
  const MetricCard({required this.icon, required this.value, required this.label, required this.color, super.key});
  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.all(16), decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(18)), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Icon(icon, color: AppColors.greenDark), const SizedBox(height: 14), Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.ink)), const SizedBox(height: 2), Text(label, style: const TextStyle(fontSize: 12, color: AppColors.muted))]));
}

class CareItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String detail;
  final String tag;
  final Color color;
  const CareItem({required this.icon, required this.title, required this.detail, required this.tag, required this.color, super.key});
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: AppColors.white,
      borderRadius: BorderRadius.circular(17),
      border: Border.all(color: AppColors.border),
    ),
    child: Row(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(13)),
          child: Icon(icon, color: AppColors.greenDark),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.ink)),
              const SizedBox(height: 4),
              Text(detail, style: const TextStyle(fontSize: 13, color: AppColors.muted)),
            ],
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
          decoration: BoxDecoration(color: AppColors.paleGreen, borderRadius: BorderRadius.circular(8)),
          child: Text(tag, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.greenDark)),
        ),
      ],
    ),
  );
}

class QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onPressed;
  const QuickAction({required this.icon, required this.label, required this.onPressed, super.key});
  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onPressed,
    borderRadius: BorderRadius.circular(16),
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 5),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Icon(icon, color: AppColors.greenDark),
          const SizedBox(height: 8),
          Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.muted)),
        ],
      ),
    ),
  );
}
